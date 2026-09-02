namespace TechLoop.Application.Features.MCQ.DTOs;

public sealed class LearnerMcqQuestionResponse
{
    public int Id { get; init; }
    public int SubTopicId { get; init; }
    public int TechnologyId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int Difficulty { get; init; }
    public int Mark { get; init; }
    public int Position { get; init; }
    public IReadOnlyList<LearnerMcqOptionResponse> Options { get; init; } = Array.Empty<LearnerMcqOptionResponse>();
}

public sealed class LearnerMcqOptionResponse
{
    public int Id { get; init; }
    public int QuestionId { get; init; }
    public string OptionText { get; init; } = string.Empty;
    public int Position { get; init; }
}