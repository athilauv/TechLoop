using TechLoop.Application.Features.Community.PostLikes.DTOs;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IPostLikeRepository
{
    Task<int> LikeAsync(PostLike like);
    Task<bool> UnlikeAsync(int postId, Guid userId);
    Task<bool> ExistsAsync(int postId, Guid userId);
    Task<PostLikeDto?> GetByPostAndUserAsync(int postId, Guid userId);
    Task<PostLike?> GetEntityByPostAndUserAsync(int postId, Guid userId);
}