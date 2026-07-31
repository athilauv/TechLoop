using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.SubTopics.DTOs;

public sealed class LearnerSubTopicResponse
{
    public int Id { get; set; }
    public int TopicId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Example { get; set; }
    public ExampleType? ExampleType { get; set; }
    public int Position { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; } 
}