using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Questions.DTOs;
public sealed class LearnerMcqQuestionResponse
{
    public int Id { get; set; }
    public int SubTopicId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int Mark { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public int Position { get; set; }
    public IReadOnlyList<LearnerMcqOptionResponse> Options { get; set; } = [];
}

public sealed class LearnerMcqOptionResponse
{
    public int Id { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public int Position { get; set; }
}