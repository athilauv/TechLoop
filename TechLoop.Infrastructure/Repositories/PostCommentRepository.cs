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
    public PostCommentRepository(IDapperContext context) => _context = context;
    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> CreateAsync(PostComment comment) => WithConnection(async connection =>
    {
        var parameters = new DynamicParameters();
        parameters.Add("PostId", comment.PostId);
        parameters.Add("UserId", comment.UserId);
        parameters.Add("ParentCommentId", comment.ParentCommentId);
        parameters.Add("Content", comment.Content);
        parameters.Add("CreatedBy", comment.CreatedBy);
        parameters.Add("Result", 0, DbType.Int32, ParameterDirection.InputOutput);

        return await connection.QuerySingleAsync<int>("CALL public.sp_manage_post_comment('CREATE', @PostId, @UserId, @ParentCommentId, @Content, @CreatedBy, NULL, NULL, @Result);", parameters);
    });

    public Task<bool> UpdateAsync(PostComment comment) => WithConnection(async connection =>
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", comment.Id);
        parameters.Add("Content", comment.Content);
        parameters.Add("UpdatedBy", comment.UpdatedBy);
        parameters.Add("Result", 0, DbType.Int32, ParameterDirection.InputOutput);

        var result = await connection.QuerySingleAsync<int>("CALL public.sp_manage_post_comment('UPDATE', NULL, NULL, NULL, @Content, NULL, @Id, @UpdatedBy, @Result);", parameters);
        return result == 1;
    });

    public Task<bool> DeleteAsync(int id, Guid userId) => WithConnection(async connection =>
    {
        var parameters = new DynamicParameters();
        parameters.Add("Id", id);
        parameters.Add("UserId", userId);
        parameters.Add("Result", 0, DbType.Int32, ParameterDirection.InputOutput);

        var result = await connection.QuerySingleAsync<int>("CALL public.sp_manage_post_comment('DELETE', NULL, @UserId, NULL, NULL, NULL, @Id, NULL, @Result);", parameters);
        return result == 1;
    });

    public Task<PostCommentDto?> GetByIdAsync(int id) => WithConnection(async connection =>
        await connection.QueryFirstOrDefaultAsync<PostCommentDto>(
            "SELECT * FROM fn_post_comment_get_by_id(@Id)", new { Id = id }));

    public Task<IEnumerable<PostCommentDto>> GetByPostIdAsync(int postId) => WithConnection(async connection =>
        await connection.QueryAsync<PostCommentDto>(
            "SELECT * FROM fn_post_comment_get_by_post(@PostId)", new { PostId = postId }));

    public Task<bool> ExistsAsync(int id) => WithConnection(async connection =>
        await connection.ExecuteScalarAsync<bool>("SELECT fn_post_comment_exists(@Id)", new { Id = id }));

    public Task<PostComment?> GetEntityByIdAsync(int id) => WithConnection(async connection =>
        await connection.QueryFirstOrDefaultAsync<PostComment>(
            "SELECT * FROM fn_post_comment_get_entity_by_id(@Id)", new { Id = id }));
}
