namespace TechLoop.Application.Features.TopicContributions.DTOs;

public sealed class TopicContributionPendingResponse
{
    public int Id { get; set; }
    public Guid LearnerId { get; set; }
    public int TechnologyId { get; set; }
    public int? TopicId { get; set; }
    public int? SubTopicId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Example { get; set; }
    public string? ReferenceUrl { get; set; }
    public short? ExampleType { get; set; }
    public short Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ContributionType { get; set; } = string.Empty;
}