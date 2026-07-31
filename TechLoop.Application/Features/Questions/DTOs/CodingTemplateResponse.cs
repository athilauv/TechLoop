namespace TechLoop.Application.Features.Questions.DTOs;

public sealed class CodingTemplateResponse
{
    public int Id { get; set; }
    public int TechnologyId { get; set; }
    public string StarterCode { get; set; } = string.Empty;
    public string? SolutionCode { get; set; }
}