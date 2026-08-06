using System.Data;
using Dapper;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class DiscussionCommentRepository : IDiscussionCommentRepository
{
    private readonly IDapperContext _context;

    public DiscussionCommentRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> CreateAsync(DiscussionComment comment)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<int>(
                "SELECT fn_discussion_comment_create(@DiscussionId,@UserId,@ParentCommentId,@Content,@CreatedBy)",
                new
                {
                    comment.DiscussionId,
                    comment.UserId,
                    comment.ParentCommentId,
                    comment.Content,
                    comment.CreatedBy
                });
        });

    public Task<bool> UpdateAsync(DiscussionComment comment)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_discussion_comment_update(@Id,@Content,@UpdatedBy)",
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
                "SELECT fn_discussion_comment_delete(@Id,@UserId)",
                new
                {
                    Id = id,
                    UserId = userId
                });
        });

    public Task<DiscussionComment?> GetEntityByIdAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<DiscussionComment>(
                "SELECT * FROM discussion_comments WHERE id=@Id AND deleted_at IS NULL",
                new { Id = id });
        });

    public Task<DiscussionCommentDto?> GetByIdAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<DiscussionCommentDto>(
                "SELECT * FROM fn_discussion_comment_get_by_id(@Id)",
                new { Id = id });
        });

    public Task<IEnumerable<DiscussionCommentDto>> GetByDiscussionIdAsync(int discussionId)
        => WithConnection(async connection =>
        {
            return await connection.QueryAsync<DiscussionCommentDto>(
                "SELECT * FROM fn_discussion_comment_get_by_discussion(@DiscussionId)",
                new
                {
                    DiscussionId = discussionId
                });
        });

    public Task<bool> ExistsAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_discussion_comment_exists(@Id)",
                new { Id = id });
        });
}