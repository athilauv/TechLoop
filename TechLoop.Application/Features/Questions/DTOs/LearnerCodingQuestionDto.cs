namespace TechLoop.Application.Features.Questions.DTOs;

public sealed class LearnerCodingQuestionDto
{
    public int Id { get; init; }
    public int SubTopicId { get; init; }
    public int TechnologyId { get; init; }
    public string TechnologyName { get; init; } = string.Empty;
    public short QuestionType { get; init; }public string Slug { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public int Mark { get; init; }
    public string? Hint { get; init; }
    public string? Explanation { get; init; }
    public int? TimeLimitSeconds { get; init; }
    public int? MemoryLimitMb { get; init; }
    public short Difficulty { get; init; }
    public int Position { get; init; }
    public int TotalItems { get; init; }
}