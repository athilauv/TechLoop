using TechLoop.Application.Features.Analytics.DTOs;

namespace TechLoop.Application.Features.Analytics.Queries.GetAnalytics;

public sealed class AnalyticsResponse
{
    public AnalyticsOverviewResponse? Overview { get; set; }

    public IReadOnlyList<PracticeActivityResponse> PracticeActivity { get; set; }
        = Array.Empty<PracticeActivityResponse>();

    public IReadOnlyList<TechnologyPracticeResponse> TechnologyPractice { get; set; }
        = Array.Empty<TechnologyPracticeResponse>();

    public IReadOnlyList<TopicAnalyticsResponse> TopicAnalytics { get; set; }
        = Array.Empty<TopicAnalyticsResponse>();

    public IReadOnlyList<DifficultyProgressionResponse> DifficultyProgression { get; set; }
        = Array.Empty<DifficultyProgressionResponse>();
}