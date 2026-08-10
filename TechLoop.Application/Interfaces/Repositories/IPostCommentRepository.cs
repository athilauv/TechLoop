using TechLoop.Application.Features.Community.PostComments.DTOs;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IPostCommentRepository
{
    Task<int> CreateAsync(PostComment comment);

    Task<bool> UpdateAsync(PostComment comment);

    Task<bool> DeleteAsync(int id, Guid userId);
    Task<PostComment?> GetEntityByIdAsync(int id);

    Task<PostCommentDto?> GetByIdAsync(int id);

    Task<IEnumerable<PostCommentDto>> GetByPostIdAsync(int postId);

    Task<bool> ExistsAsync(int id);
}