namespace TechLoop.Application.Features.TopicContributions.DTOs;

public sealed class TopicContributionResponse
{
    public int Id { get; set; }
    public Guid LearnerId { get; set; }
    public string LearnerName { get; set; } = string.Empty;
    public int TechnologyId { get; set; }
    public string TechnologyName { get; set; } = string.Empty;
    public int? TopicId { get; set; }
    public string? TopicTitle { get; set; }
    public int? SubTopicId { get; set; }
    public string? SubTopicTitle { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Example { get; set; }
    public short? ExampleType { get; set; }
    public string? ReferenceUrl { get; set; }
    public short Status { get; set; }
    public string? ReviewNotes { get; set; }
    public Guid? ReviewedBy { get; set; }
    public string? ReviewerName { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? ReviewedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}