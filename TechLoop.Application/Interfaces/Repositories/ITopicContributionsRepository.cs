using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ITopicContributionRepository
{
    
    Task<bool> TechnologyExistsAsync(int technologyId, CancellationToken cancellationToken);
    Task<int> CreateAsync(
        Guid learnerId,
        int technologyId,
        int? topicId,
        int? subTopicId,
        string title,
        string description,
        string? example,
        short? exampleType,
        string? referenceUrl,
        CancellationToken cancellationToken);
    Task<bool> ReviewAsync(
        int contributionId,
        short status,
        string? reviewNotes,
        Guid reviewedBy,
        CancellationToken cancellationToken);
    Task<IEnumerable<TopicContributionSummaryResponse>> GetMyContributionsAsync(Guid learnerId, CancellationToken cancellationToken);
    Task<IEnumerable<TopicContributionResponse>> GetTechnologyContributionsAsync(int technologyId, CancellationToken cancellationToken);
    Task<TopicContributionResponse?> GetByIdAsync(int contributionId, CancellationToken cancellationToken);
    Task<TopicContributionResponse?> GetMyContributionByIdAsync(Guid learnerId, int contributionId, CancellationToken cancellationToken);
}