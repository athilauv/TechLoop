namespace TechLoop.Application.Features.Curriculum.DTOs;

public sealed class CurriculumRowResponse
{
    public int TechnologyId { get; set; }
    public string TechnologyName { get; set; } = string.Empty;
    public int? TopicId { get; set; }
    public string? TopicTitle { get; set; }
    public string? TopicSlug { get; set; }
    public int? TopicPosition { get; set; }
    public DateTimeOffset? TopicPublishedAt { get; set; }
    public DateTimeOffset? TopicCreatedAt { get; set; }
    public DateTimeOffset? TopicUpdatedAt { get; set; }
    public int? SubTopicId { get; set; }
    public string? SubTopicTitle { get; set; }
    public string? SubTopicSlug { get; set; }
    public int? SubTopicPosition { get; set; }
    public DateTimeOffset? SubTopicPublishedAt { get; set; }
    public DateTimeOffset? SubTopicCreatedAt { get; set; }
    public DateTimeOffset? SubTopicUpdatedAt { get; set; }
}