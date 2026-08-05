using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IUserTopicProgressRepository
{
    Task<UserTopicProgress?> GetByUserAndTopicAsync(Guid userId, int topicId, CancellationToken cancellationToken);
    Task<IEnumerable<UserTopicProgress>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<Guid> CreateAsync(UserTopicProgress progress, CancellationToken cancellationToken);
    Task<int> UpdateAsync(UserTopicProgress progress, CancellationToken cancellationToken);
}