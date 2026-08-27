using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDapperContext _context;
    public UserRepository(IDapperContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid userId)
    {
        using var connection = _context.CreateConnection();
        const string sql = """
            SELECT
                id,
                username,
                email,
                password_hash,
                role_id,
                failed_login_attempts,
                locked_until,
                last_login_at,
                created_at,
                updated_at
            FROM users
            WHERE id = @Id;
            """;
        return await connection.QueryFirstOrDefaultAsync<User>(
            sql,
            new { Id = userId });
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        using var connection = _context.CreateConnection();
        const string sql = """
            SELECT
                id,
                username,
                email,
                password_hash,
                role_id,
                failed_login_attempts,
                locked_until,
                last_login_at,
                created_at,
                updated_at
            FROM users
            WHERE username = @Username;
            """;
        return await connection.QueryFirstOrDefaultAsync<User>(
            sql,
            new { Username = username });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var connection = _context.CreateConnection();
        const string sql = """
            SELECT
                id,
                username,
                email,
                password_hash,
                role_id,
                failed_login_attempts,
                locked_until,
                last_login_at,
                created_at,
                updated_at
            FROM users
            WHERE email = @Email;
            """;
        return await connection.QueryFirstOrDefaultAsync<User>(
            sql,
            new { Email = email });
    }

    public async Task AddAsync(User user)
    {
        using var connection = _context.CreateConnection();
        const string sql = """
            INSERT INTO users
            (
                id,
                username,
                email,
                password_hash,
                role_id,
                failed_login_attempts,
                locked_until,
                last_login_at,
                created_at,
                updated_at
            )
            VALUES
            (
                @Id,
                @Username,
                @Email,
                @PasswordHash,
                @RoleId,
                @FailedLoginAttempts,
                @LockedUntil,
                @LastLoginAt,
                @CreatedAt,
                @UpdatedAt
            );
            """;
        await connection.ExecuteAsync(sql, user);
    }

    public async Task UpdateAsync(User user)
    {
        using var connection = _context.CreateConnection();
        const string sql = """
            UPDATE users
            SET
                username = @Username,
                email = @Email,
                password_hash = @PasswordHash,
                role_id = @RoleId,
                updated_at = @UpdatedAt
            WHERE id = @Id;
            """;
        await connection.ExecuteAsync(sql, user);
    }

    public async Task UpdateSecurityAsync(User user)
    {
        using var connection = _context.CreateConnection();
        const string sql = """
            UPDATE users
            SET
                failed_login_attempts = @FailedLoginAttempts,
                locked_until = @LockedUntil,
                last_login_at = @LastLoginAt,
                updated_at = @UpdatedAt
            WHERE id = @Id;
            """;
        await connection.ExecuteAsync(sql, user);
    }

    public async Task DeleteAsync(Guid userId)
    {
        using var connection = _context.CreateConnection();
        const string sql = """
            DELETE FROM users
            WHERE id = @Id;
            """;
        await connection.ExecuteAsync(sql, new { Id = userId });
    }
    
    public async Task UpdatePasswordAsync(Guid userId, string passwordHash, DateTime updatedAt)
    {
        using var connection = _context.CreateConnection();
        const string sql = """
                           UPDATE users
                           SET
                               password_hash = @PasswordHash,
                               updated_at = @UpdatedAt
                           WHERE id = @Id;
                           """;

        await connection.ExecuteAsync(sql,
            new
            {
                Id = userId,
                PasswordHash = passwordHash,
                UpdatedAt = updatedAt
            });
    }
}