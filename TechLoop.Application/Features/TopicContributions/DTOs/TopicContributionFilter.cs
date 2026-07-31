namespace TechLoop.Application.Features.TopicContributions.DTOs;

public sealed class TopicContributionFilter
{
    public int? TechnologyId { get; set; }
    public int? TopicId { get; set; }
    public int? SubTopicId { get; set; }
    public short? Status { get; set; }
    public Guid? LearnerId { get; set; }
}