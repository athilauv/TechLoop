using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Submissions.Queries.GetQuestionSubmissions;

public sealed class GetQuestionSubmissionsQueryHandler : IRequestHandler<GetQuestionSubmissionsQuery, IEnumerable<SubmissionResponse>>
{
    private readonly ISubmissionRepository _submissionRepository;
    public GetQuestionSubmissionsQueryHandler(ISubmissionRepository submissionRepository)
    {
        _submissionRepository = submissionRepository;
    }

    public async Task<IEnumerable<SubmissionResponse>> Handle(GetQuestionSubmissionsQuery request, CancellationToken cancellationToken)
    {
        // Validate request
        if (request is null)
            throw new BadRequestException("Request cannot be null.");

        if (request.QuestionId <= 0)
            throw new BadRequestException("Question ID must be greater than 0.");

        // Retrieve submissions
        var submissions = (await _submissionRepository.GetByQuestionIdAsync(request.QuestionId, cancellationToken)).ToList();

        // No submissions found
        if (!submissions.Any())
            throw new NotFoundException($"No submissions found for Question ID {request.QuestionId}.");

        // Map entity to response DTO
        return submissions.Select(submission => new SubmissionResponse
        {
            Id = submission.Id,
            UserId = submission.UserId,
            QuestionId = submission.QuestionId,
            TechnologyId = submission.TechnologyId,
            SourceCode = submission.SourceCode,
            Status = submission.Status,
            ExecutionTimeMs = submission.ExecutionTimeMs,
            MemoryUsedMb = submission.MemoryUsedMb,
            PassedTestCases = submission.PassedTestCases,
            TotalTestCases = submission.TotalTestCases,
            Score = submission.Score,
            SubmittedAt = submission.SubmittedAt,
            CompilerOutput = submission.CompilerOutput,
            RuntimeOutput = submission.RuntimeOutput,
            AiReview = submission.AiReview,
            JudgeToken = submission.JudgeToken
        });
    }
}