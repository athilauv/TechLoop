namespace TechLoop.Application.Features.TopicContributions.DTOs;

public sealed class CreateTopicContributionRequest
{
    public int TechnologyId { get; set; }
    public int? TopicId { get; set; }
    public int? SubTopicId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Example { get; set; }
    public short? ExampleType { get; set; }
    public string? ReferenceUrl { get; set; }
}