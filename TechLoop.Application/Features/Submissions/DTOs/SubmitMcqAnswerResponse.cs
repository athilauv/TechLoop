namespace TechLoop.Application.Features.Submissions.DTOs;

public sealed class SubmitMcqAnswerResponse
{
    public int SubmissionId { get; set; }

    public bool IsCorrect { get; set; }

    public int Score { get; set; }

    public string Message { get; set; } = string.Empty;
}