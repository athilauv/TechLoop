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
    public PostLikeRepository(IDapperContext context) => _context = context;
    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> LikeAsync(PostLike like) => WithConnection(async connection =>
    {
        var parameters = new DynamicParameters();
        parameters.Add("PostId", like.PostId);
        parameters.Add("UserId", like.UserId);
        parameters.Add("Result", 0, DbType.Int32, ParameterDirection.InputOutput);

        return await connection.QuerySingleAsync<int>("CALL public.sp_manage_post_like('CREATE', @PostId, @UserId, @Result);", parameters);
    });

    public Task<bool> UnlikeAsync(int postId, Guid userId) => WithConnection(async connection =>
    {
        var parameters = new DynamicParameters();
        parameters.Add("PostId", postId);
        parameters.Add("UserId", userId);
        parameters.Add("Result", 0, DbType.Int32, ParameterDirection.InputOutput);

        var result = await connection.QuerySingleAsync<int>("CALL public.sp_manage_post_like('DELETE', @PostId, @UserId, @Result);", parameters);
        return result == 1;
    });

    public Task<bool> ExistsAsync(int postId, Guid userId) => WithConnection(async connection =>
        await connection.ExecuteScalarAsync<bool>("SELECT fn_post_like_exists(@PostId,@UserId)", new { PostId = postId, UserId = userId }));

    public Task<PostLikeDto?> GetByPostAndUserAsync(int postId, Guid userId) => WithConnection(async connection =>
        await connection.QueryFirstOrDefaultAsync<PostLikeDto>(
            "SELECT * FROM fn_post_like_get(@PostId,@UserId)", new { PostId = postId, UserId = userId }));

    public Task<PostLike?> GetEntityByPostAndUserAsync(int postId, Guid userId) => WithConnection(async connection =>
        await connection.QueryFirstOrDefaultAsync<PostLike>(
            "SELECT * FROM fn_post_like_entity(@PostId,@UserId)", new { PostId = postId, UserId = userId }));
}
