namespace TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgress;

public sealed class GetUserTopicProgressResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int TopicId { get; set; }
    public int CompletedQuestions { get; set; }
    public DateTime? LastPracticedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}