using System.Data;
using Dapper;
using TechLoop.Application.Features.Community.PostComments.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class PostCommentRepository : IPostCommentRepository
{
    private readonly IDapperContext _context;

    public PostCommentRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> CreateAsync(PostComment comment)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<int>(
                "SELECT fn_post_comment_create(@PostId,@UserId,@ParentCommentId,@Content,@CreatedBy)",
                new
                {
                    comment.PostId,
                    comment.UserId,
                    comment.ParentCommentId,
                    comment.Content,
                    comment.CreatedBy
                });
        });

    public Task<bool> UpdateAsync(PostComment comment)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_post_comment_update(@Id,@Content,@UpdatedBy)",
                new
                {
                    comment.Id,
                    comment.Content,
                    comment.UpdatedBy
                });
        });

    public Task<bool> DeleteAsync(int id, Guid userId)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_post_comment_delete(@Id,@UserId)",
                new
                {
                    Id = id,
                    UserId = userId
                });
        });

    public Task<PostCommentDto?> GetByIdAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<PostCommentDto>(
                "SELECT * FROM fn_post_comment_get_by_id(@Id)",
                new { Id = id });
        });

    public Task<IEnumerable<PostCommentDto>> GetByPostIdAsync(int postId)
        => WithConnection(async connection =>
        {
            return await connection.QueryAsync<PostCommentDto>(
                "SELECT * FROM fn_post_comment_get_by_post(@PostId)",
                new { PostId = postId });
        });

    public Task<bool> ExistsAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_post_comment_exists(@Id)",
                new { Id = id });
        });

    public Task<PostComment?> GetEntityByIdAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<PostComment>(
                @"SELECT *
                  FROM post_comments
                  WHERE id = @Id
                    AND deleted_at IS NULL",
                new { Id = id });
        });
}