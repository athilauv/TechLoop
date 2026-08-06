using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IDiscussionRepository
{
    Task<int> CreateAsync(Discussion discussion);
    Task<bool> UpdateAsync(Discussion discussion);
    Task<bool> DeleteAsync(int id, Guid userId);
    Task<bool> PinAsync(int id, bool isPinned, Guid updatedBy);
    Task<Discussion?> GetByIdAsync(int id);
    Task<IEnumerable<Discussion>> GetAllAsync();
    Task<IEnumerable<Discussion>> GetByQuestionIdAsync(int questionId);
    Task<bool> ExistsAsync(int id);
}