namespace TechLoop.Application.Features.Admin.DTOs;

public sealed class AdminDashboardResponse
{
    public int UsersCount { get; set; }
    public int MentorsCount { get; set; }
    public int TechnologyCategoriesCount { get; set; }
    public int TechnologiesCount { get; set; }
    public int TopicsCount { get; set; }
    public int SubTopicsCount { get; set; }
    public int QuestionsCount { get; set; }
    public int PublishedQuestionsCount { get; set; }
    public int ActiveDiscussionsCount { get; set; }
    public int CommunityPostsCount { get; set; }
    public int PendingContributionsCount { get; set; }
}
