namespace TechLoop.Application.Features.Analytics.DTOs;

public sealed class DailyActivityResponse
{
    public DateTime Date { get; set; }
    public int TotalActivities { get; set; }
    public int QuestionsSolved { get; set; }
    public int CodingCompleted { get; set; }
    public int McqsCompleted { get; set; }
    public int SuccessfulAttempts { get; set; }
    public int FailedAttempts { get; set; }
    public int TimeSpentMinutes { get; set; }
}
