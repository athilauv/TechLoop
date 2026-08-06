using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IDiscussionCommentRepository
{
    Task<int> CreateAsync(DiscussionComment comment);
    Task<bool> UpdateAsync(DiscussionComment comment);
    Task<bool> DeleteAsync(int id, Guid userId);
    // Entity (Commands)
    Task<DiscussionComment?> GetEntityByIdAsync(int id);
    // DTO (Queries)
    Task<DiscussionCommentDto?> GetByIdAsync(int id);
    Task<IEnumerable<DiscussionCommentDto>> GetByDiscussionIdAsync(int discussionId);
    Task<bool> ExistsAsync(int id);
}