namespace TechLoop.Application.Features.Mentor.DTOs;

public sealed class CreateMentorRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int TechnologyId { get; set; }
}