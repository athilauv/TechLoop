namespace TechLoop.Application.Features.Curriculum.DTOs;

public sealed class LearnerCurriculumSubTopicResponse
{
    public int Id { get; set; }
    public int TopicId { get; set; }
    public int? ParentSubTopicId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int Position { get; set; }
   // public List<CurriculumSubTopicResponse> Children { get; set; } = [];
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}