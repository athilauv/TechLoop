namespace TechLoop.Application.Features.Admin.DTOs;

public sealed class AdminMentorOverviewResponse
{
    public int MentorId { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int TechnologyId { get; set; }
    public string TechnologyName { get; set; } = string.Empty;
    public int TopicsCount { get; set; }
    public int SubTopicsCount { get; set; }
    public int QuestionsCount { get; set; }
    public int PublishedQuestionsCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
