using TechLoop.Domain.Enums;

namespace TechLoop.Domain.Entities;

public sealed class TopicContribution
{
    public int Id { get; set; }
    public int TechnologyId { get; set; }
    public int? TopicId { get; set; }
    public int? SubTopicId { get; set; }
    public CurriculumContributionType ContributionType { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Example { get; set; }
    public ExampleType? ExampleType { get; set; }
    public string? ReferenceUrl { get; set; }
    public ContributionStatus Status { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid? ReviewedBy { get; set; }
    public DateTimeOffset? ReviewedAt { get; set; }
    public Guid? PublishedBy { get; set; }
    public DateTimeOffset? PublishedAt { get; set; }
    public Guid? RejectedBy { get; set; }
    public DateTimeOffset? RejectedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
}