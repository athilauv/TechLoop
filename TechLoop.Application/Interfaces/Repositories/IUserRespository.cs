using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid userId);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task UpdateSecurityAsync(User user);
    Task UpdatePasswordAsync(Guid userId, string passwordHash, DateTime updatedAt);
    Task DeleteAsync(Guid userId);
}