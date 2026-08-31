using Dapper;
using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Infrastructure.Repositories;

public sealed class AdminRepository : IAdminRepository
{
    private readonly IDapperContext _context;
    public AdminRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<System.Data.IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<AdminDashboardResponse> GetDashboardAsync(CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM fn_admin_dashboard();";
        return WithConnection(connection => connection.QuerySingleAsync<AdminDashboardResponse>(
            new CommandDefinition(sql, cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<AdminUserResponse>> GetUsersAsync(CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM fn_admin_get_users();";
        return WithConnection(connection => connection.QueryAsync<AdminUserResponse>(
            new CommandDefinition(sql, cancellationToken: cancellationToken)));
    }

    public Task<bool> UpdateUserRoleAsync(Guid userId, int roleId, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_admin_update_user_role(@UserId,@RoleId);";
        return WithConnection(connection => connection.QuerySingleAsync<bool>(
            new CommandDefinition(sql, new { UserId = userId, RoleId = roleId }, cancellationToken: cancellationToken)));
    }

    public Task<AdminMentorOverviewResponse?> GetMentorOverviewAsync(int mentorId, CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM fn_admin_get_mentor_overview(@MentorId);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<AdminMentorOverviewResponse>(
            new CommandDefinition(sql, new { MentorId = mentorId }, cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<TopicContributionPendingResponse>> GetPendingContributionsAsync(CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM fn_admin_get_pending_topic_contributions();";
        return WithConnection(connection => connection.QueryAsync<TopicContributionPendingResponse>(
            new CommandDefinition(sql, cancellationToken: cancellationToken)));
    }
}
