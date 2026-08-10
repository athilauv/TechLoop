using System.Data;
using Dapper;
using TechLoop.Application.Features.Community.SavedPosts.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class SavedPostRepository : ISavedPostRepository
{
    private readonly IDapperContext _context;

    public SavedPostRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> SaveAsync(SavedPost savedPost)
        => WithConnection(connection =>
            connection.ExecuteScalarAsync<int>(
                "SELECT fn_saved_post_create(@PostId,@UserId)",
                new
                {
                    savedPost.PostId,
                    savedPost.UserId
                }));

    public Task<bool> UnsaveAsync(int postId, Guid userId)
        => WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                "SELECT fn_saved_post_delete(@PostId,@UserId)",
                new
                {
                    PostId = postId,
                    UserId = userId
                }));

    public Task<bool> ExistsAsync(int postId, Guid userId)
        => WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                "SELECT fn_saved_post_exists(@PostId,@UserId)",
                new
                {
                    PostId = postId,
                    UserId = userId
                }));

    public Task<SavedPostDto?> GetByPostAndUserAsync(int postId, Guid userId)
        => WithConnection(connection =>
            connection.QueryFirstOrDefaultAsync<SavedPostDto>(
                "SELECT * FROM fn_saved_post_get(@PostId,@UserId)",
                new
                {
                    PostId = postId,
                    UserId = userId
                }));

    public Task<SavedPost?> GetEntityByPostAndUserAsync(int postId, Guid userId)
        => WithConnection(connection =>
            connection.QueryFirstOrDefaultAsync<SavedPost>(
                @"SELECT *
                  FROM saved_posts
                  WHERE post_id = @PostId
                    AND user_id = @UserId",
                new
                {
                    PostId = postId,
                    UserId = userId
                }));

    public Task<IEnumerable<SavedPostDto>> GetSavedPostsAsync(Guid userId)
        => WithConnection(connection =>
            connection.QueryAsync<SavedPostDto>(
                "SELECT * FROM fn_saved_posts_get(@UserId)",
                new
                {
                    UserId = userId
                }));
}