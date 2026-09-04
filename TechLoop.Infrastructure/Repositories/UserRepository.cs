using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly IDapperContext _context;

    public UserRepository(IDapperContext context) => _context = context;

    public async Task<User?> GetByIdAsync(Guid userId)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM public.fn_user_get_by_id(@Id);",
            new { Id = userId });
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM public.fn_user_get_by_username(@Username);",
            new { Username = username });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM public.fn_user_get_by_email(@Email);",
            new { Email = email });
    }

    public async Task AddAsync(User user)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(
            @"CALL public.sp_manage_user(
                'CREATE', @Id, @Username, @Email, @PasswordHash, @RoleId,
                @FailedLoginAttempts, @LockedUntil, @LastLoginAt, @CreatedAt, @UpdatedAt, FALSE);",
            user);
    }

    public async Task UpdateAsync(User user)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(
            @"CALL public.sp_manage_user(
                'UPDATE', @Id, @Username, @Email, @PasswordHash, @RoleId,
                NULL, NULL, NULL, NULL, @UpdatedAt, FALSE);",
            user);
    }

    public async Task UpdateSecurityAsync(User user)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(
            @"CALL public.sp_manage_user(
                'UPDATE_SECURITY', @Id, NULL, NULL, NULL, NULL,
                @FailedLoginAttempts, @LockedUntil, @LastLoginAt, NULL, @UpdatedAt, FALSE);",
            user);
    }

    public async Task DeleteAsync(Guid userId)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(
            @"CALL public.sp_manage_user(
                'DELETE', @Id, NULL, NULL, NULL, NULL,
                NULL, NULL, NULL, NULL, NULL, FALSE);",
            new { Id = userId });
    }

    public async Task UpdatePasswordAsync(Guid userId, string passwordHash, DateTime updatedAt)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(
            @"CALL public.sp_manage_user(
                'UPDATE_PASSWORD', @Id, NULL, NULL, @PasswordHash, NULL,
                NULL, NULL, NULL, NULL, @UpdatedAt, FALSE);",
            new { Id = userId, PasswordHash = passwordHash, UpdatedAt = updatedAt });
    }
}
