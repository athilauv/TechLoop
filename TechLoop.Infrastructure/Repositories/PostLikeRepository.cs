using System.Data;
using Dapper;
using TechLoop.Application.Features.Community.PostLikes.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class PostLikeRepository : IPostLikeRepository
{
    private readonly IDapperContext _context;

    public PostLikeRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> LikeAsync(PostLike like)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<int>(
                "SELECT fn_post_like_create(@PostId,@UserId)",
                new
                {
                    like.PostId,
                    like.UserId
                });
        });

    public Task<bool> UnlikeAsync(int postId, Guid userId)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_post_unlike(@PostId,@UserId)",
                new
                {
                    PostId = postId,
                    UserId = userId
                });
        });

    public Task<bool> ExistsAsync(int postId, Guid userId)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_post_like_exists(@PostId,@UserId)",
                new
                {
                    PostId = postId,
                    UserId = userId
                });
        });

    public Task<PostLikeDto?> GetByPostAndUserAsync(int postId, Guid userId)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<PostLikeDto>(
                "SELECT * FROM fn_post_like_get(@PostId,@UserId)",
                new
                {
                    PostId = postId,
                    UserId = userId
                });
        });

    public Task<PostLike?> GetEntityByPostAndUserAsync(int postId, Guid userId)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<PostLike>(
                @"SELECT *
                  FROM post_likes
                  WHERE post_id = @PostId
                    AND user_id = @UserId",
                new
                {
                    PostId = postId,
                    UserId = userId
                });
        });
}