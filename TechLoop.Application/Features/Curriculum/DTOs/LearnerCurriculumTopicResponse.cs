namespace TechLoop.Application.Features.Curriculum.DTOs;

public sealed class LearnerCurriculumTopicResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int Position { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public List<LearnerCurriculumSubTopicResponse> SubTopics { get; set; } = [];
}