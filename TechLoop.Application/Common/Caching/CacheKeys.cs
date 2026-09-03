namespace TechLoop.Application.Common.Caching;

public static class CacheKeys
{
    public const string Technologies = "technologies:published";
    public const string Topics = "topics:published";
    public const string SubTopics = "subtopics:published";
    public const string TechnologyCategories = "technology-categories:published";

    public static string TechnologyBySlug(string slug)
        => $"technology:published:{slug}";

    public static string TopicBySlug(string slug)
        => $"topic:published:{slug}";

    public static string SubTopicBySlug(string slug)
        => $"subtopic:published:{slug}";

    public static string TechnologyCategoryById(int id)
        => $"technology-category:published:{id}";

    public static string Curriculum(int technologyId)
        => $"curriculum:{technologyId}";
}
