using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Submissions.DTOs;

public sealed class UpdateSubmissionRequest
{
    public SubmissionStatus Status { get; set; }
    public int? ExecutionTimeMs { get; set; }
    public int? MemoryUsedMb { get; set; }
    public int? PassedTestCases { get; set; }
    public int? TotalTestCases { get; set; }
    public int? Score { get; set; }
    public string? CompilerOutput { get; set; }
    public string? RuntimeOutput { get; set; }
    public string? AiReview { get; set; }
    public string? JudgeToken { get; set; }
}