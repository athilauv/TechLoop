using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ISubTopicsRepository
{
    Task<bool> SubTopicIdExistsAsync(int subTopicId, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(int topicId, string slug, CancellationToken cancellationToken);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken);
    Task<bool> PositionExistsAsync(int topicId, int position, CancellationToken cancellationToken);
    Task<int> CreateAsync(SubTopic subTopic, CancellationToken cancellationToken);
    Task<int> UpdateAsync(SubTopic subTopic, CancellationToken cancellationToken);
    Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken);
    Task<bool> TopicExistsAsync(int topicId, CancellationToken cancellationToken);
    Task<int> PublishAsync(SubTopic subTopic, CancellationToken cancellationToken);
    Task<SubTopic?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<IEnumerable<SubTopic>> GetAllAsync(CancellationToken cancellationToken);
    Task<IEnumerable<SubTopic>> GetPublishedAsync(CancellationToken cancellationToken);
    Task<SubTopic?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken);
    Task<int?> GetTechnologyIdAsync(int subTopicId, CancellationToken cancellationToken);
    Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<int> GetTopicIdAsync(int subTopicId, CancellationToken cancellationToken);
}