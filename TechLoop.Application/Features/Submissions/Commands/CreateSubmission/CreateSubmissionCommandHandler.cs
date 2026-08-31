using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Submissions.Commands.CreateSubmission;

public sealed class CreateSubmissionCommandHandler
    : IRequestHandler<CreateSubmissionCommand, CreateSubmissionResponse>
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly ISubmissionExecutionService _submissionExecutionService;

    public CreateSubmissionCommandHandler(
        ISubmissionRepository submissionRepository,
        IQuestionRepository questionRepository,
        ISubmissionExecutionService submissionExecutionService)
    {
        _submissionRepository = submissionRepository;
        _questionRepository = questionRepository;
        _submissionExecutionService = submissionExecutionService;
    }

    public async Task<CreateSubmissionResponse> Handle(
        CreateSubmissionCommand request,
        CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetPublishedByIdAsync(
            request.Request.QuestionId,
            cancellationToken);

        if (question is null)
            throw new NotFoundException("Published question not found.");

        if (question.QuestionType != QuestionType.coding)
            throw new ValidationException(
                "Source-code submissions are only allowed for coding questions.");

        var questionTechnologyId =
            await _questionRepository.GetQuestionTechnologyIdAsync(
                question.Id,
                cancellationToken);

        if (!questionTechnologyId.HasValue ||
            questionTechnologyId.Value <= 0)
        {
            throw new ValidationException(
                "Technology is not configured for this coding question.");
        }

        if (request.Request.TechnologyId != questionTechnologyId.Value)
        {
            throw new ValidationException(
                "The selected technology does not match the coding question.");
        }

        var alreadySolved =
            await _submissionRepository.IsQuestionSolvedAsync(
                request.UserId,
                request.Request.QuestionId,
                cancellationToken);

        if (alreadySolved)
            throw new ConflictException(
                "You have already solved this question.");

        var attemptNumber =
            await _submissionRepository.GetNextAttemptNumberAsync(
                request.UserId,
                request.Request.QuestionId,
                cancellationToken);

        var submission = new Submission
        {
            UserId = request.UserId,
            QuestionId = request.Request.QuestionId,
            TechnologyId = questionTechnologyId.Value,
            AttemptNumber = attemptNumber,
            SourceCode = request.Request.SourceCode.Trim(),
            Status = SubmissionStatus.Pending,
            SubmittedAt = DateTime.UtcNow
        };

        var id = await _submissionRepository.CreateAsync(
            submission,
            cancellationToken);

        submission.Id = id;

        try
        {
            await _submissionExecutionService.ExecuteAsync(
                submission,
                question,
                cancellationToken);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception)
        {
            // Keep the submission visible to the learner instead of turning
            // an execution/configuration failure into an opaque HTTP 500.
            submission.Status = SubmissionStatus.RuntimeError;

            try
            {
                await _submissionRepository.UpdateResultAsync(
                    submission,
                    cancellationToken);
            }
            catch
            {
                // If the result cannot be persisted, the original execution
                // failure is still represented by the created submission.
            }
        }

        return new CreateSubmissionResponse
        {
            Id = id,
            Message = submission.Status == SubmissionStatus.RuntimeError
                ? "Submission was created, but code execution failed. Check the result for details."
                : "Submission created and evaluated successfully."
        };
    }
}
