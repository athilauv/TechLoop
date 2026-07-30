using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IMentorRepository
{
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken);
    Task<bool> TechnologyExistsAsync(int technologyId, CancellationToken cancellationToken);
    Task<int> CreateAsync(Guid userId, int technologyId, DateTimeOffset createdAt, CancellationToken cancellationToken);
    Task<IEnumerable<MentorAdminResponse>> GetAllAsync(CancellationToken cancellationToken);
    Task<MentorAdminResponse?> GetByIdAsync(int mentorId, CancellationToken cancellationToken);
    Task<MentorProfileResponse?> GetMyProfileAsync(Guid userId, CancellationToken cancellationToken);
    Task UpdateProfileAsync(Guid userId, string? phoneNumber, string? bio, string? linkedInUrl, string? githubUrl, string? profileImageUrl, DateTimeOffset updatedAt, CancellationToken cancellationToken);
    Task DeleteAsync(int mentorId, DateTimeOffset deletedAt, CancellationToken cancellationToken);
}