using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly IDapperContext _context;

    private async Task<T> WithConnection<T>(Func<System.Data.IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    private async Task WithConnection(Func<System.Data.IDbConnection, Task> action)
    {
        using var connection = _context.CreateConnection();
        await action(connection);
    }

    public RefreshTokenRepository(IDapperContext context)
    {
        _context = context;
    }

    public Task<RefreshToken?> GetByTokenAsync(string token)
    {
    return WithConnection(async connection =>
    {
        
            const string sql = """
                SELECT
                    id,
                    user_id,
                    token,
                    expires_at,
                    is_revoked,
                    created_at,
                    updated_at
                FROM refresh_tokens
                WHERE token = @Token;
                """;
            return await connection.QueryFirstOrDefaultAsync<RefreshToken>(
                sql,
                new { Token = token });
    
    });
    }

    public Task<IEnumerable<RefreshToken>> GetByUserIdAsync(Guid userId)
    {
    return WithConnection(async connection =>
    {
        
            const string sql = """
                SELECT
                    id,
                    user_id,
                    token,
                    expires_at,
                    is_revoked,
                    created_at,
                    updated_at
                FROM refresh_tokens
                WHERE user_id = @UserId
                ORDER BY created_at DESC;
                """;
            return await connection.QueryAsync<RefreshToken>(
                sql,
                new { UserId = userId });
    
    });
    }

    public Task AddAsync(RefreshToken refreshToken)
    {
    return WithConnection(async connection =>
    {
        
            const string sql = """
                INSERT INTO refresh_tokens
                (
                    id,
                    user_id,
                    token,
                    expires_at,
                    is_revoked,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    @Id,
                    @UserId,
                    @Token,
                    @ExpiresAt,
                    @IsRevoked,
                    @CreatedAt,
                    @UpdatedAt
                );
                """;
            await connection.ExecuteAsync(sql, refreshToken);
    
    });
    }
    public Task UpdateAsync(RefreshToken refreshToken)
    {
    return WithConnection(async connection =>
    {
        
            const string sql = """
                UPDATE refresh_tokens
                SET
                    token = @Token,
                    expires_at = @ExpiresAt,
                    is_revoked = @IsRevoked,
                    updated_at = @UpdatedAt
                WHERE id = @Id;
                """;
            await connection.ExecuteAsync(sql, refreshToken);
    
    });
    }
    public Task RevokeAsync(Guid id)
    {
    return WithConnection(async connection =>
    {
        
            const string sql = """
                UPDATE refresh_tokens
                SET
                    is_revoked = TRUE,
                    updated_at = NOW()
                WHERE id = @Id;
                """;
            await connection.ExecuteAsync(sql, new { Id = id });
    
    });
    }
}