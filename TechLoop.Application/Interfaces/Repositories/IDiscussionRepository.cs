using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IDiscussionRepository
{
    Task<int> CreateAsync(Discussion discussion);
    Task<bool> UpdateAsync(Discussion discussion);
    Task<bool> DeleteAsync(int id, Guid userId);
    Task<bool> PinAsync(int id, bool isPinned, Guid updatedBy);
    // Read operations return DTOs
    Task<DiscussionDto?> GetByIdAsync(int id);
    Task<IEnumerable<DiscussionDto>> GetAllAsync();
    Task<IEnumerable<DiscussionDto>> GetByQuestionIdAsync(int questionId);
    // Validation
    Task<bool> ExistsAsync(int id);
    Task<Discussion?> GetEntityByIdAsync(int id);

}