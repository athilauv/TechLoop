namespace TechLoop.Application.Feature.Judge0.DTOs;

public sealed class RunCodeRequest
{
    public int QuestionId { get; set; }
    public string SourceCode { get; set; } = string.Empty;
    public string? StandardInput { get; set; }
    public string? ExpectedOutput { get; set; }
    public decimal? CpuTimeLimit { get; set; }
    public decimal? MemoryLimit { get; set; }
}
