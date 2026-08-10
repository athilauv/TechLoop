using TechLoop.Application.Features.Community.SavedPosts.DTOs;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ISavedPostRepository
{
    Task<int> SaveAsync(SavedPost savedPost);
    Task<bool> UnsaveAsync(int postId, Guid userId);
    Task<bool> ExistsAsync(int postId, Guid userId);
    Task<SavedPostDto?> GetByPostAndUserAsync(int postId, Guid userId);
    Task<SavedPost?> GetEntityByPostAndUserAsync(int postId, Guid userId);
    Task<IEnumerable<SavedPostDto>> GetSavedPostsAsync(Guid userId);
}