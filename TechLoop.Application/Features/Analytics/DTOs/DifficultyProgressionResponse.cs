namespace TechLoop.Application.Features.Analytics.DTOs;

public sealed class DifficultyProgressionResponse
{
    public int Difficulty { get; set; }

    public string DifficultyName { get; set; } = string.Empty;

    public int TotalAttempts { get; set; }

    public int SuccessfulAttempts { get; set; }

    public int FailedAttempts { get; set; }
}