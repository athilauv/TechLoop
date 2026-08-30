namespace TechLoop.Application.Features.Coding.DTOs;

public sealed class CreateCodingTemplateRequest
{
    public int TechnologyId { get; set; }
    public string StarterCode { get; set; } = string.Empty;
    public string? ExecutionCode { get; set; }
    public string? SolutionCode { get; set; }
}
