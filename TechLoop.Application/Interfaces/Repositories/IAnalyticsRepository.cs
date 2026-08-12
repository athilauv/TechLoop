using TechLoop.Application.Features.Analytics.DTOs;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IAnalyticsRepository
{
    Task<AnalyticsOverviewResponse?> GetOverviewAsync(Guid userId, CancellationToken cancellationToken);
    Task<IReadOnlyList<PracticeActivityResponse>> GetPracticeActivityAsync(Guid userId, CancellationToken cancellationToken);
    Task<IReadOnlyList<TechnologyPracticeResponse>> GetTechnologyPracticeAsync(Guid userId, CancellationToken cancellationToken);
    Task<IReadOnlyList<TopicAnalyticsResponse>> GetTopicAnalyticsAsync(Guid userId, CancellationToken cancellationToken);
    Task<IReadOnlyList<DifficultyProgressionResponse>> GetDifficultyProgressionAsync(Guid userId, CancellationToken cancellationToken);
}