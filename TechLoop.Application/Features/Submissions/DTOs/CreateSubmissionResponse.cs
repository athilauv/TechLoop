namespace TechLoop.Application.Features.Submissions.DTOs;

public sealed class CreateSubmissionResponse
{
    public int Id { get; set; }
    public string Message { get; set; } = string.Empty;
}