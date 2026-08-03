namespace TechLoop.Application.Features.Submissions.DTOs;

public sealed class SubmitMcqAnswerRequest
{
    public int QuestionId { get; set; }
    public int TechnologyId { get; set; }
    public int SelectedOptionId { get; set; }
}