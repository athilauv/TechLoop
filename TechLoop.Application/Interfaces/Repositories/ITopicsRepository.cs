using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Domain;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ITopicsRepository
{
    Task<bool> ExistsAsync(int technologyId, string name, CancellationToken cancellationToken);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken);
    Task<bool> PositionExistsAsync(int technologyId, int position, CancellationToken cancellationToken);
    Task<bool> TechnologyExistsAsync(int technologyId, CancellationToken cancellationToken);
    Task<int> CreateAsync(Topic topic, bool shiftPositions, CancellationToken cancellationToken);
    Task<int> UpdateAsync(Topic topic, bool shiftPositions, CancellationToken cancellationToken);
    Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken);
    Task<int> PublishAsync(Topic topic, CancellationToken cancellationToken);
    Task<IEnumerable<Topic>> GetAllAsync(CancellationToken cancellationToken);
    Task<Topic?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<IEnumerable<Topic>> GetPublishedAsync(CancellationToken cancellationToken);
    Task<Topic?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken);
    Task<int?> GetTechnologyIdAsync(int topicId, CancellationToken cancellationToken);
    Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<IEnumerable<MentorTopicResponse>> GetUnpublishedTopicsForMentorAsync(Guid mentorId, CancellationToken cancellationToken);
}