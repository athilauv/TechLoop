using TechLoop.Domain.Enums;

namespace TechLoop.Application.DTOs.Questions.Requests;

public class UpdateQuestionRequest
{
    public int SubTopicId { get; set; }
    public QuestionType QuestionType { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; } = string.Empty;
    public int Mark { get; set; }
    public string Hint { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public int? TimeLimitSeconds { get; set; }
    public int? MemoryLimitMb { get; set; }
    public DifficultyLevel Difficulty { get; set; } 
    public int Position { get; set; }
    public bool ShiftPositions { get; set; }
}