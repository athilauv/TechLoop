namespace TechLoop.Application.Features.Coding.DTOs;

public sealed class MentorCodingTemplateResponse
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public int TechnologyId { get; set; }
    public string StarterCode { get; set; } = string.Empty;
    public string? SolutionCode { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
