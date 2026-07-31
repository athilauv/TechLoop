using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Questions.DTOs;

public sealed class QuestionDetailsResponse
{
    // Question
    public int Id { get; set; }
    public int? SubTopicId { get; set; }
    public QuestionType QuestionType { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int Mark { get; set; }
    public string? Hint { get; set; }
    public string? Explanation { get; set; }
    public int? TimeLimitSeconds { get; set; }
    public int? MemoryLimitMb { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public int Position { get; set; }

    // MCQ (Only when QuestionType == MCQ)
    public List<QuestionMcqOptionResponse>? Options { get; set; }

    // Coding (Only when QuestionType == Coding)
    public CodingTemplateResponse? CodingTemplate { get; set; }

    public List<TestCaseResponse>? TestCases { get; set; }
}