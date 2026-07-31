namespace TechLoop.Application.Features.TopicContributions.DTOs;

public sealed class TopicContributionSummaryResponse
{
    public int Id { get; set; }
    public string TechnologyName { get; set; } = string.Empty;
    public string TopicTitle { get; set; } = string.Empty;
    public string? SubTopicTitle { get; set; }
    public short Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}