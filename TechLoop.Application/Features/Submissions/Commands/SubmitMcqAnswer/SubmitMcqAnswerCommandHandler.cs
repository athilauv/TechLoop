using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Submissions.Commands.SubmitMcqAnswer;

public sealed class SubmitMcqAnswerCommandHandler : IRequestHandler<SubmitMcqAnswerCommand, SubmitMcqAnswerResponse>
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly IMcqOptionRepository _mcqOptionRepository;

    public SubmitMcqAnswerCommandHandler(
        ISubmissionRepository submissionRepository,
        IQuestionRepository questionRepository,
        IMcqOptionRepository mcqOptionRepository)
    {
        _submissionRepository = submissionRepository;
        _questionRepository = questionRepository;
        _mcqOptionRepository = mcqOptionRepository;
    }

    public async Task<SubmitMcqAnswerResponse> Handle(SubmitMcqAnswerCommand request, CancellationToken cancellationToken)
    {
        // Check question
        var question = await _questionRepository.GetByIdAsync(request.Request.QuestionId, cancellationToken);
        if (question is null)
            throw new NotFoundException("Question not found.");

        if (question.QuestionType != QuestionType.mcq)
            throw new BadRequestException("Selected question is not an MCQ.");

        // Check option
        var option = await _mcqOptionRepository.GetByIdAsync(request.Request.SelectedOptionId, cancellationToken);
        if (option is null)
            throw new NotFoundException("MCQ option not found.");

        if (option.QuestionId != question.Id)
            throw new BadRequestException("Selected option does not belong to this question.");

        // Next attempt
        var attemptNumber = await _submissionRepository.GetNextAttemptNumberAsync(
            request.UserId, question.Id, cancellationToken);

        // Create submission
        var submission = new Submission
        {
            UserId = request.UserId,
            QuestionId = question.Id,
            TechnologyId = request.Request.TechnologyId,
            SourceCode = string.Empty,
            SelectedOptionId = option.Id,
            AttemptNumber = attemptNumber,
            Status = option.IsCorrect
                ? SubmissionStatus.Accepted
                : SubmissionStatus.WrongAnswer,
            Score = option.IsCorrect
                ? question.Mark
                : 0,
            PassedTestCases = option.IsCorrect ? 1 : 0,
            TotalTestCases = 1,
            SubmittedAt = DateTime.UtcNow
        };

        var submissionId = await _submissionRepository.CreateAsync(submission, cancellationToken);
        return new SubmitMcqAnswerResponse
        {
            SubmissionId = submissionId,
            IsCorrect = option.IsCorrect,
            Score = submission.Score ?? 0,
            Message = option.IsCorrect
                ? "Correct Answer"
                : "Wrong Answer"
        };
    }
}