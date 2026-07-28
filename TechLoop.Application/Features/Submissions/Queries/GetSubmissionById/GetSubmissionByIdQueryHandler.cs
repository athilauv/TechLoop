using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Submissions.Queries.GetSubmissionById;

public sealed class GetSubmissionByIdQueryHandler : IRequestHandler<GetSubmissionByIdQuery, SubmissionResponse?>
{
    private readonly ISubmissionRepository _submissionRepository;
    public GetSubmissionByIdQueryHandler(ISubmissionRepository submissionRepository)
    {
        _submissionRepository = submissionRepository;
    }

    public async Task<SubmissionResponse?> Handle(GetSubmissionByIdQuery request, CancellationToken cancellationToken)
    {
        // Validate request
        if (request is null)
            throw new BadRequestException("Request cannot be null.");

        if (request.Id <= 0)
            throw new BadRequestException("Submission ID must be greater than 0.");

        // Retrieve submission
        var submission = await _submissionRepository.GetByIdAsync(request.Id, cancellationToken);

        // Submission not found
        if (submission is null)
            throw new NotFoundException($"Submission with ID {request.Id} was not found.");

        // Map entity to response DTO
        return new SubmissionResponse
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
        };
    }
}