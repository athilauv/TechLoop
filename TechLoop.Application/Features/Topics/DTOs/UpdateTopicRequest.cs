using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Topics.DTOs;

public class UpdateTopicRequest
{
    public int TechnologyId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; } = string.Empty;
    public string? Example { get; set; }
    public ExampleType? ExampleType { get; set; }
    public int Position { get; set; }
}