using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Questions.DTOs;

public sealed class MentorQuestionResponse
{
    public int Id { get; set; }
    public int SubTopicId { get; set; }
    public QuestionType QuestionType { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int Mark { get; set; }
    public string Hint { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public int? TimeLimitSeconds { get; set; }
    public int? MemoryLimitMb { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public int Position { get; set; }
    public DateTime? PublishedAt { get; set; }
    public Guid? PublishedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }

    public int TotalItems { get; set; }
}