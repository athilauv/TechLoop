using System.Data;
using Dapper;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class CommunityPostRepository : ICommunityPostRepository
{
    private readonly IDapperContext _context;

    public CommunityPostRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> CreateAsync(CommunityPost post)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<int>(
                "SELECT fn_community_post_create(@UserId,@TechnologyId,@Title,@Content,@CreatedBy)",
                new
                {
                    post.UserId,
                    post.TechnologyId,
                    post.Title,
                    post.Content,
                    post.CreatedBy
                });
        });

    public Task<bool> UpdateAsync(CommunityPost post)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_community_post_update(@Id,@Title,@Content,@UpdatedBy)",
                new
                {
                    post.Id,
                    post.Title,
                    post.Content,
                    post.UpdatedBy
                });
        });

    public Task<bool> DeleteAsync(int id, Guid userId)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_community_post_delete(@Id,@UserId)",
                new
                {
                    Id = id,
                    UserId = userId
                });
        });

    public Task<bool> PinAsync(int id, bool isPinned, Guid updatedBy)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_community_post_pin(@Id,@IsPinned,@UpdatedBy)",
                new
                {
                    Id = id,
                    IsPinned = isPinned,
                    UpdatedBy = updatedBy
                });
        });

    public Task<CommunityPostDto?> GetByIdAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<CommunityPostDto>(
                "SELECT * FROM fn_community_post_get_by_id(@Id)",
                new { Id = id });
        });

    public Task<IEnumerable<CommunityPostDto>> GetFeedAsync()
        => WithConnection(async connection =>
        {
            return await connection.QueryAsync<CommunityPostDto>(
                "SELECT * FROM fn_community_post_get_feed()");
        });

    public Task<bool> ExistsAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_community_post_exists(@Id)",
                new { Id = id });
        });

    public Task<CommunityPost?> GetEntityByIdAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<CommunityPost>(
                @"SELECT *
                  FROM community_posts
                  WHERE id = @Id
                    AND deleted_at IS NULL",
                new { Id = id });
        });
}