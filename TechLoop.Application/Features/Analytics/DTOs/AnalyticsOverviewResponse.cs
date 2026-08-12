namespace TechLoop.Application.Features.Analytics.DTOs;

public sealed class AnalyticsOverviewResponse
{
    public int QuestionsSolved { get; set; }
    public int CodingCompleted { get; set; }
    public int McqsCompleted { get; set; }
    public int TotalSubmissions { get; set; }
    public int AcceptedSubmissions { get; set; }
    public int FailedAttempts { get; set; }
    public int TotalTimeSpentMinutes { get; set; }
}