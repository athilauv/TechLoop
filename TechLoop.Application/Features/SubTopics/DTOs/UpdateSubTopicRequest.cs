using TechLoop.Domain.Enums;

namespace TechLoop.Application.DTOs.SubTopics.Requests;

public sealed class UpdateSubTopicRequest
{
    public int TopicId { get; set; }
    public int? ParentSubTopicId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string? Example { get; set; }
    public ExampleType? ExampleType { get; set; }
    public int Position { get; set; }
    public bool ShiftPositions { get; set; }
}