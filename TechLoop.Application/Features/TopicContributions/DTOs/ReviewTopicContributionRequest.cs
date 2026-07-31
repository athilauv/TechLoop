namespace TechLoop.Application.Features.TopicContributions.DTOs;

public sealed class ReviewTopicContributionRequest
{
    public int Id { get; set; }
    public short Status { get; set; }
    public string? ReviewNotes { get; set; }
}