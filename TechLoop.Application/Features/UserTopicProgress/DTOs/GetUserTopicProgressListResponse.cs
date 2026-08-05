namespace TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgressList;

public sealed class GetUserTopicProgressListResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int TopicId { get; set; }
    public int CompletedQuestions { get; set; }
    public DateTime? LastPracticedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}