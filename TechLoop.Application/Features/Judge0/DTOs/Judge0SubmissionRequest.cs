namespace TechLoop.Application.Feature.Judge0.DTOs;

public sealed class Judge0SubmissionRequest
{
    public string SourceCode { get; set; } = string.Empty;

    public int LanguageId { get; set; }

    public string? StandardInput { get; set; }

    public string? ExpectedOutput { get; set; }

    public decimal? CpuTimeLimit { get; set; }

    public decimal? MemoryLimit { get; set; }
}