using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ICommunityPostRepository
{
    Task<int> CreateAsync(CommunityPost post);

    Task<bool> UpdateAsync(CommunityPost post);

    Task<bool> DeleteAsync(int id, Guid userId);

    Task<bool> PinAsync(int id, bool isPinned, Guid updatedBy);

    Task<CommunityPost?> GetEntityByIdAsync(int id);

    Task<CommunityPostDto?> GetByIdAsync(int id);

    Task<IEnumerable<CommunityPostDto>> GetFeedAsync();

    Task<bool> ExistsAsync(int id);
}