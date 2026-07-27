namespace TechLoop.Application.Features.Topics.DTOs;

public sealed class LearnerTopicResponse
{
    public int Id { get; set; }
    public int TechnologyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int Position { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}