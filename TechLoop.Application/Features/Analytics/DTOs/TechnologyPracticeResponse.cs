namespace TechLoop.Application.Features.Analytics.DTOs;

public sealed class TechnologyPracticeResponse
{
    public int TechnologyId { get; set; }
    public string TechnologyName { get; set; } = string.Empty;
    public int TotalAttempts { get; set; }
    public int SuccessfulAttempts { get; set; }
    public int FailedAttempts { get; set; }
}