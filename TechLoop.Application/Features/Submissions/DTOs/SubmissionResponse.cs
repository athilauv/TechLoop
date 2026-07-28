using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Submissions.DTOs;

public sealed class SubmissionResponse
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int QuestionId { get; set; }
    public int TechnologyId { get; set; }
    public string SourceCode { get; set; } = string.Empty;
    public SubmissionStatus Status { get; set; }
    public int? ExecutionTimeMs { get; set; }
    public int? MemoryUsedMb { get; set; }
    public int? PassedTestCases { get; set; }
    public int? TotalTestCases { get; set; }
    public int? Score { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string? CompilerOutput { get; set; }
    public string? RuntimeOutput { get; set; }
    public string? AiReview { get; set; }
    public string? JudgeToken { get; set; }
}