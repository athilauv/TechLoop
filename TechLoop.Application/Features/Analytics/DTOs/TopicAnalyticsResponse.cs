namespace TechLoop.Application.Features.Analytics.DTOs;

public sealed class TopicAnalyticsResponse
{
    public int TopicId { get; set; }
    public string TopicName { get; set; } = string.Empty;
    public int CompletedQuestions { get; set; }
    public DateTime? LastPracticedAt { get; set; }
}