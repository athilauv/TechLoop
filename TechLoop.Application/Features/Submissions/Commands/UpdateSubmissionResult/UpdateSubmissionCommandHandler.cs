using MediatR;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Submissions.Commands.UpdateSubmissionResult;

public sealed class UpdateSubmissionCommandHandler : IRequestHandler<UpdateSubmissionCommand, UpdateSubmissionResponse>
{
    private readonly ISubmissionRepository _submissionRepository;
    public UpdateSubmissionCommandHandler(ISubmissionRepository submissionRepository)
    {
        _submissionRepository = submissionRepository;
    }

    public async Task<UpdateSubmissionResponse> Handle(UpdateSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = await _submissionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (submission is null)
            throw new KeyNotFoundException("Submission not found.");

        submission.Status = request.Request.Status;
        submission.ExecutionTimeMs = request.Request.ExecutionTimeMs;
        submission.MemoryUsedMb = request.Request.MemoryUsedMb;
        submission.PassedTestCases = request.Request.PassedTestCases;
        submission.TotalTestCases = request.Request.TotalTestCases;
        submission.Score = request.Request.Score;
        submission.CompilerOutput = request.Request.CompilerOutput;
        submission.RuntimeOutput = request.Request.RuntimeOutput;
        submission.AiReview = request.Request.AiReview;
        submission.JudgeToken = request.Request.JudgeToken;

        await _submissionRepository.UpdateResultAsync(submission, cancellationToken);
        return new UpdateSubmissionResponse
        {
            Message = "Submission updated successfully."
        };
    }
}