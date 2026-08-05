namespace TechLoop.Application.Features.UserStatistics.Queries.GetUserStatistics;

public sealed class GetUserStatisticsResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int ReputationPoints { get; set; }
    public int QuestionsSolved { get; set; }
    public int CodingSolved { get; set; }
    public int McqSolved { get; set; }
    public int TotalSubmissions { get; set; }
    public int AcceptedSubmissions { get; set; }
    public int FailedSubmissions { get; set; }
    public int TotalTimeSpentMinutes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}