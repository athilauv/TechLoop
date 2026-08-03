using TechLoop.Domain.Enums;

namespace TechLoop.Domain.Entities;

public class Submission
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int QuestionId { get; set; }
    public int TechnologyId { get; set; }
    public int AttemptNumber { get; set; }
    public int? SelectedOptionId { get; set; }
    public string SourceCode { get; set; } = string.Empty;
    public SubmissionStatus Status { get; set; }
    public int? ExecutionTimeMs  { get; set; }
    public int? MemoryUsedMb { get; set; }
    public int? PassedTestCases { get; set; }
    public int? TotalTestCases { get; set; }
    public int? Score { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string? CompilerOutput { get; set; } = string.Empty;
    public string? RuntimeOutput { get; set; } = string.Empty;
    public string? AiReview { get; set; } = string.Empty;
    public string? JudgeToken { get; set; } =  string.Empty;
}