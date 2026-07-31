namespace TechLoop.Application.Features.Questions.DTOs;

public sealed class QuestionMcqOptionResponse
{
    public int Id { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int Position { get; set; }
}