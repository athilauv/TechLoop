using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Features.UserStatistics.UpdateUserStatistics;
using TechLoop.Application.Features.UserTopicProgress.UpdateUserTopicProgress;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Submissions.Commands.SubmitMcqAnswer;

public sealed class SubmitMcqAnswerCommandHandler
    : IRequestHandler<SubmitMcqAnswerCommand, SubmitMcqAnswerResponse>
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly IMcqOptionRepository _mcqOptionRepository;
    private readonly IMediator _mediator;

    public SubmitMcqAnswerCommandHandler(
        ISubmissionRepository submissionRepository,
        IQuestionRepository questionRepository,
        IMcqOptionRepository mcqOptionRepository,
        IMediator mediator)
    {
        _submissionRepository = submissionRepository;
        _questionRepository = questionRepository;
        _mcqOptionRepository = mcqOptionRepository;
        _mediator = mediator;
    }

    public async Task<SubmitMcqAnswerResponse> Handle(
        SubmitMcqAnswerCommand request,
        CancellationToken cancellationToken)
    {
        Console.WriteLine("===== SubmitMcqAnswer Started =====");

        // Learners may only submit answers for published questions.
        var question = await _questionRepository.GetPublishedByIdAsync(
            request.Request.QuestionId,
            cancellationToken);

        if (question is null)
            throw new NotFoundException("Question not found.");

        Console.WriteLine($"Question Id : {question.Id}");
        Console.WriteLine($"SubTopic Id : {question.SubTopicId}");

        if (question.QuestionType != QuestionType.mcq)
            throw new BadRequestException("Selected question is not an MCQ.");

        var questionTechnologyId =
            await _questionRepository.GetQuestionTechnologyIdAsync(
                question.Id,
                cancellationToken);

        if (!questionTechnologyId.HasValue ||
            questionTechnologyId.Value != request.Request.TechnologyId)
        {
            throw new BadRequestException(
                "Selected question does not belong to the selected technology.");
        }

        var alreadySolved = await _submissionRepository.IsQuestionSolvedAsync(
            request.UserId,
            question.Id,
            cancellationToken);

        Console.WriteLine($"Already Solved : {alreadySolved}");

        if (alreadySolved)
            throw new BadRequestException("You have already solved this question.");

        var option = await _mcqOptionRepository.GetByIdAsync(
            request.Request.SelectedOptionId,
            cancellationToken);

        if (option is null)
            throw new NotFoundException("MCQ option not found.");

        Console.WriteLine($"Selected Option : {option.Id}");
        Console.WriteLine($"Is Correct : {option.IsCorrect}");

        if (option.QuestionId != question.Id)
            throw new BadRequestException(
                "Selected option does not belong to this question.");

        var attemptNumber =
            await _submissionRepository.GetNextAttemptNumberAsync(
                request.UserId,
                question.Id,
                cancellationToken);

        Console.WriteLine($"Attempt Number : {attemptNumber}");

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

        Console.WriteLine($"Submission Status : {submission.Status}");

        var submissionId = await _submissionRepository.CreateAsync(
            submission,
            cancellationToken);

        submission.Id = submissionId;

        Console.WriteLine($"Submission Created : {submissionId}");

        Console.WriteLine("Calling UpdateUserStatistics...");
        await _mediator.Send(
            new UpdateUserStatisticsCommand(submission),
            cancellationToken);
        Console.WriteLine("UpdateUserStatistics Completed");

        Console.WriteLine("Calling UpdateUserTopicProgress...");
        await _mediator.Send(
            new UpdateUserTopicProgressCommand(
                submission,
                question),
            cancellationToken);
        Console.WriteLine("UpdateUserTopicProgress Completed");

        Console.WriteLine("===== SubmitMcqAnswer Finished =====");

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