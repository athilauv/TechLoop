using System.Data;
using Dapper;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class DiscussionRepository : IDiscussionRepository
{
    private readonly IDapperContext _context;
    public DiscussionRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> CreateAsync(Discussion discussion)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<int>(
                "SELECT fn_discussion_create(@UserId, @QuestionId, @Title, @Content, @CreatedBy)",
                new
                {
                    discussion.UserId,
                    discussion.QuestionId,
                    discussion.Title,
                    discussion.Content,
                    discussion.CreatedBy
                });
        });

    public Task<bool> UpdateAsync(Discussion discussion)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_discussion_update(@Id, @Title, @Content, @UpdatedBy)",
                new
                {
                    discussion.Id,
                    discussion.Title,
                    discussion.Content,
                    discussion.UpdatedBy
                });
        });

    public Task<bool> DeleteAsync(int id, Guid userId)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_discussion_delete(@Id, @UserId)",
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
                "SELECT fn_discussion_pin(@Id, @IsPinned, @UpdatedBy)",
                new
                {
                    Id = id,
                    IsPinned = isPinned,
                    UpdatedBy = updatedBy
                });
        });

    public Task<DiscussionDto?> GetByIdAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<DiscussionDto>(
                "SELECT * FROM fn_discussion_get_by_id(@Id)",
                new { Id = id });
        });

    public async Task<PagedResult<DiscussionDto>> GetAllAsync(int page, int pageSize, string? search, string? sort)
    {
        using var connection = _context.CreateConnection();
        var rows = (await connection.QueryAsync<DiscussionDto>(
            "SELECT * FROM fn_discussion_get_all(@Page,@PageSize,@Search,@Sort)",
            new { Page=page, PageSize=pageSize, Search=search, Sort=sort })).ToList();
        return new PagedResult<DiscussionDto> { Items=rows, Page=page, PageSize=pageSize, TotalItems=rows.FirstOrDefault()?.TotalItems ?? 0 };
    }

    public Task<IEnumerable<DiscussionDto>> GetByQuestionIdAsync(int questionId)
        => WithConnection(async connection =>
        {
            return await connection.QueryAsync<DiscussionDto>(
                "SELECT * FROM fn_discussion_get_by_question(@QuestionId)",
                new
                {
                    QuestionId = questionId
                });
        });

    public Task<bool> ExistsAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.ExecuteScalarAsync<bool>(
                "SELECT fn_discussion_exists(@Id)",
                new { Id = id });
        });
    
    public Task<Discussion?> GetEntityByIdAsync(int id)
        => WithConnection(async connection =>
        {
            return await connection.QueryFirstOrDefaultAsync<Discussion>(
                "SELECT * FROM discussions WHERE id = @Id AND deleted_at IS NULL",
                new { Id = id });
        });
}