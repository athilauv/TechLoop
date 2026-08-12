namespace TechLoop.Application.Features.Analytics.DTOs;

public sealed class PracticeActivityResponse
{
    public DateTime Date { get; set; }
    public int TotalAttempts { get; set; }
    public int SuccessfulAttempts { get; set; }
    public int FailedAttempts { get; set; }
}