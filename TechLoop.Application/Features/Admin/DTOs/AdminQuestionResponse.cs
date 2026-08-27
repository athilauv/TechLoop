using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Admin.DTOs;

public sealed class AdminQuestionResponse
{
    public int Id { get; set; }
    public int SubTopicId { get; set; }
    public QuestionType QuestionType { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DifficultyLevel Difficulty { get; set; }
    public int Mark { get; set; }
    public int Position { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
