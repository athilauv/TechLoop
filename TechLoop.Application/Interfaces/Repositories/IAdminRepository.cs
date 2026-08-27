using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IAdminRepository
{
    Task<AdminDashboardResponse> GetDashboardAsync(CancellationToken cancellationToken);
    Task<IEnumerable<AdminUserResponse>> GetUsersAsync(CancellationToken cancellationToken);
    Task<bool> UpdateUserRoleAsync(Guid userId, int roleId, CancellationToken cancellationToken);
    Task<AdminMentorOverviewResponse?> GetMentorOverviewAsync(int mentorId, CancellationToken cancellationToken);
    Task<IEnumerable<TopicContributionPendingResponse>> GetPendingContributionsAsync(CancellationToken cancellationToken);
}
