using MediatR;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Analytics.Queries.GetAnalytics;

public sealed class GetAnalyticsQueryHandler : IRequestHandler<GetAnalyticsQuery, AnalyticsResponse>
{
    private readonly IAnalyticsRepository _analyticsRepository;

    public GetAnalyticsQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    public async Task<AnalyticsResponse> Handle(GetAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var overviewTask = _analyticsRepository.GetOverviewAsync(request.UserId, cancellationToken);
        var practiceActivityTask = _analyticsRepository.GetPracticeActivityAsync(request.UserId, cancellationToken);
        var technologyPracticeTask = _analyticsRepository.GetTechnologyPracticeAsync(request.UserId, cancellationToken);
        var topicAnalyticsTask = _analyticsRepository.GetTopicAnalyticsAsync(request.UserId, cancellationToken);
        var difficultyProgressionTask = _analyticsRepository.GetDifficultyProgressionAsync(request.UserId, cancellationToken);
        
        await Task.WhenAll(
            overviewTask,
            practiceActivityTask,
            technologyPracticeTask,
            topicAnalyticsTask,
            difficultyProgressionTask);

        return new AnalyticsResponse
        {
            Overview = await overviewTask,
            PracticeActivity = await practiceActivityTask,
            TechnologyPractice = await technologyPracticeTask,
            TopicAnalytics = await topicAnalyticsTask,
            DifficultyProgression = await difficultyProgressionTask
        };
    }
}