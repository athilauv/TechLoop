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

    public async Task<CreateSubmissionResponse> Handle(CreateSubmissionCommand request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.Request.QuestionId, cancellationToken);

        if (question is null)
        {
            throw new NotFoundException("Question not found.");
        }

        var attemptNumber = await _submissionRepository.GetNextAttemptNumberAsync(request.UserId, request.Request.QuestionId, cancellationToken);
        var submission = new Submission
        {
            UserId = request.UserId,
            QuestionId = request.Request.QuestionId,
            TechnologyId = request.Request.TechnologyId,
            AttemptNumber = attemptNumber,
            SourceCode = request.Request.SourceCode,
            Status = SubmissionStatus.Pending,
            SubmittedAt = DateTime.UtcNow
        };

        var id = await _submissionRepository.CreateAsync(submission, cancellationToken);
        submission.Id = id;

        try
        {
            await _submissionExecutionService.ExecuteAsync(submission, question, cancellationToken);
        }
        catch
        {
            submission.Status = SubmissionStatus.RuntimeError;
            await _submissionRepository.UpdateResultAsync(submission, cancellationToken);
            throw;
        }

        return new CreateSubmissionResponse
        {
            Id = id,
            Message = "Submission created successfully."
        };
    }
}