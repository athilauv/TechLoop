using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class UserRepository : IUserRepository
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

    public UserRepository(IDapperContext context) => _context = context;

    public Task<User?> GetByIdAsync(Guid userId)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM public.fn_user_get_by_id(@Id);",
                new { Id = userId });
    
    });
    }

    public Task<User?> GetByUsernameAsync(string username)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM public.fn_user_get_by_username(@Username);",
                new { Username = username });
    
    });
    }

    public Task<User?> GetByEmailAsync(string email)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM public.fn_user_get_by_email(@Email);",
                new { Email = email });
    
    });
    }

    public Task AddAsync(User user)
    {
    return WithConnection(async connection =>
    {
        
            await connection.ExecuteAsync(
                @"CALL public.sp_manage_user(
                    'CREATE', @Id, @Username, @Email, @PasswordHash, @RoleId,
                    @FailedLoginAttempts, @LockedUntil, @LastLoginAt, @CreatedAt, @UpdatedAt, FALSE);",
                user);
    
    });
    }

    public Task UpdateAsync(User user)
    {
    return WithConnection(async connection =>
    {
        
            await connection.ExecuteAsync(
                @"CALL public.sp_manage_user(
                    'UPDATE', @Id, @Username, @Email, @PasswordHash, @RoleId,
                    NULL, NULL, NULL, NULL, @UpdatedAt, FALSE);",
                user);
    
    });
    }

    public Task UpdateSecurityAsync(User user)
    {
    return WithConnection(async connection =>
    {
        
            await connection.ExecuteAsync(
                @"CALL public.sp_manage_user(
                    'UPDATE_SECURITY', @Id, NULL, NULL, NULL, NULL,
                    @FailedLoginAttempts, @LockedUntil, @LastLoginAt, NULL, @UpdatedAt, FALSE);",
                user);
    
    });
    }

    public Task DeleteAsync(Guid userId)
    {
    return WithConnection(async connection =>
    {
        
            await connection.ExecuteAsync(
                @"CALL public.sp_manage_user(
                    'DELETE', @Id, NULL, NULL, NULL, NULL,
                    NULL, NULL, NULL, NULL, NULL, FALSE);",
                new { Id = userId });
    
    });
    }

    public Task UpdatePasswordAsync(Guid userId, string passwordHash, DateTime updatedAt)
    {
    return WithConnection(async connection =>
    {
        
            await connection.ExecuteAsync(
                @"CALL public.sp_manage_user(
                    'UPDATE_PASSWORD', @Id, NULL, NULL, @PasswordHash, NULL,
                    NULL, NULL, NULL, NULL, @UpdatedAt, FALSE);",
                new { Id = userId, PasswordHash = passwordHash, UpdatedAt = updatedAt });
    
    });
    }
}
