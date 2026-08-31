using Dapper;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class MentorRepository : IMentorRepository
{
    private readonly IDapperContext _context;
    public MentorRepository(IDapperContext context)
    {
        _context = context;
    }

    //email exists
    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleAsync<bool>(new CommandDefinition("SELECT fn_mentor_email_exists(@Email);",
                new { Email = email },
                cancellationToken: cancellationToken));
    }

    //technology exists
    public async Task<bool> TechnologyExistsAsync(int technologyId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleAsync<bool>(new CommandDefinition(
            "SELECT EXISTS (SELECT 1 FROM fn_get_technology_by_id(@TechnologyId));",
            new { TechnologyId = technologyId },
            cancellationToken: cancellationToken));
    }

    //create mentor
    public async Task<int> CreateAsync(Guid userId, int technologyId, DateTimeOffset createdAt, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(
            "CALL public.sp_manage_mentor('CREATE', @UserId, @TechnologyId, @CreatedAt, CAST(NULL AS integer), CAST(NULL AS timestamptz), CAST(NULL AS integer));",
            new
            {
                UserId = userId,
                TechnologyId = technologyId,
                CreatedAt = createdAt
            },
            cancellationToken: cancellationToken));
    }

    //get all mentors
    public async Task<IEnumerable<MentorAdminResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<MentorAdminResponse>(new CommandDefinition("SELECT * FROM fn_get_all_mentors();", cancellationToken: cancellationToken));
    }

    //get mentor by id
    public async Task<MentorAdminResponse?> GetByIdAsync( int mentorId,
        CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<MentorAdminResponse>(new CommandDefinition("SELECT * FROM fn_get_mentor_by_id(@MentorId);",
                new { MentorId = mentorId },
                cancellationToken: cancellationToken));
    }

    //get profile (for mentor)
    public async Task<MentorProfileResponse?> GetMyProfileAsync(Guid userId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<MentorProfileResponse>(new CommandDefinition("SELECT * FROM fn_get_my_profile(@UserId);",
                new { UserId = userId },
                cancellationToken: cancellationToken));
    }

    //update profile (for mentor)
    public async Task UpdateProfileAsync(Guid userId, string? phoneNumber, string? bio, string? linkedInUrl, string? githubUrl, string? profileImageUrl, DateTimeOffset updatedAt, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(@"CALL sp_update_mentor_profile( @UserId, @PhoneNumber, @Bio, @LinkedInUrl, @GithubUrl, @ProfileImageUrl, @UpdatedAt);",
                new
                {
                    UserId = userId,
                    PhoneNumber = phoneNumber,
                    Bio = bio,
                    LinkedInUrl = linkedInUrl,
                    GithubUrl = githubUrl,
                    ProfileImageUrl = profileImageUrl,
                    UpdatedAt = updatedAt
                },
                cancellationToken: cancellationToken));
    }

    //Soft-delete 
    public async Task DeleteAsync(int mentorId, DateTimeOffset deletedAt, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            "CALL public.sp_manage_mentor('DELETE', CAST(NULL AS uuid), CAST(NULL AS integer), CAST(NULL AS timestamptz), @MentorId, @DeletedAt, CAST(NULL AS integer));",
            new
            {
                MentorId = mentorId,
                DeletedAt = deletedAt
            },
            cancellationToken: cancellationToken));
    }
}