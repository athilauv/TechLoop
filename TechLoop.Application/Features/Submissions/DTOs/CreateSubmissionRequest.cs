namespace TechLoop.Application.Features.Submissions.DTOs;

public sealed class CreateSubmissionRequest
{
    public int QuestionId { get; set; }
    public int TechnologyId { get; set; }
    public string SourceCode { get; set; } = string.Empty;
}