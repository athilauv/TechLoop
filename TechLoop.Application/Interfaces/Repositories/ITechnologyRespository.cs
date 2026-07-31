using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ITechnologyRepository
{
    Task<bool> ExistsAsync(int categoryId, string name, CancellationToken cancellationToken);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken);
    Task<bool> PositionExistsAsync(int categoryId, int position, CancellationToken cancellationToken);
    Task<bool> CategoryExistsAsync(int categoryId, CancellationToken cancellationToken);
    Task<int> CreateAsync(Technology technology, CancellationToken cancellationToken);
    Task<int> UpdateAsync(Technology technology, CancellationToken cancellationToken);
    
    Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken);
    Task<int> PublishAsync(Technology technology, CancellationToken cancellationToken);
    Task<IEnumerable<Technology>> GetAllAsync(CancellationToken cancellationToken);
    Task<Technology?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<IEnumerable<Technology>> GetPublishedAsync(CancellationToken cancellationToken);
    Task<Technology?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken);
    Task<int?> GetTechnologyIdAsync(int topicId, CancellationToken cancellationToken);
    Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken);
}