using Dapper;
using TechLoop.Application.Features.Analytics.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Infrastructure.Repositories;

public sealed class AnalyticsRepository : IAnalyticsRepository
{
    private readonly IDapperContext _context;

    public AnalyticsRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(
        Func<System.Data.IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    private async Task WithConnection(
        Func<System.Data.IDbConnection, Task> action)
    {
        using var connection = _context.CreateConnection();
        await action(connection);
    }

    public Task<AnalyticsOverviewResponse?> GetOverviewAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        const string sql =
            "SELECT * FROM fn_analytics_overview(@UserId);";

        return WithConnection(connection =>
            connection.QuerySingleOrDefaultAsync<AnalyticsOverviewResponse>(
                new CommandDefinition(
                    sql,
                    new { UserId = userId },
                    cancellationToken: cancellationToken)));
    }

    public Task<IReadOnlyList<PracticeActivityResponse>> GetPracticeActivityAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return WithConnection<IReadOnlyList<PracticeActivityResponse>>(async connection =>
        {
            const string sql =
                "SELECT * FROM fn_analytics_practice_activity(@UserId);";

            var result = await connection.QueryAsync<PracticeActivityResponse>(
                new CommandDefinition(
                    sql,
                    new { UserId = userId },
                    cancellationToken: cancellationToken));

            return result.ToList();
        });
    }

    public Task<IReadOnlyList<TechnologyPracticeResponse>> GetTechnologyPracticeAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return WithConnection<IReadOnlyList<TechnologyPracticeResponse>>(async connection =>
        {
            const string sql =
                "SELECT * FROM fn_analytics_technology_practice(@UserId);";

            var result = await connection.QueryAsync<TechnologyPracticeResponse>(
                new CommandDefinition(
                    sql,
                    new { UserId = userId },
                    cancellationToken: cancellationToken));

            return result.ToList();
        });
    }

    public Task<IReadOnlyList<TopicAnalyticsResponse>> GetTopicAnalyticsAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return WithConnection<IReadOnlyList<TopicAnalyticsResponse>>(async connection =>
        {
            const string sql =
                "SELECT * FROM fn_analytics_topic(@UserId);";

            var result = await connection.QueryAsync<TopicAnalyticsResponse>(
                new CommandDefinition(
                    sql,
                    new { UserId = userId },
                    cancellationToken: cancellationToken));

            return result.ToList();
        });
    }

    public Task<IReadOnlyList<DifficultyProgressionResponse>> GetDifficultyProgressionAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return WithConnection<IReadOnlyList<DifficultyProgressionResponse>>(async connection =>
        {
            const string sql =
                "SELECT * FROM fn_analytics_difficulty(@UserId);";

            var result = await connection.QueryAsync<DifficultyProgressionResponse>(
                new CommandDefinition(
                    sql,
                    new { UserId = userId },
                    cancellationToken: cancellationToken));

            return result.ToList();
        });
    }

    public Task<IReadOnlyList<DailyActivityResponse>> GetDailyActivityAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return WithConnection<IReadOnlyList<DailyActivityResponse>>(async connection =>
        {
            const string sql =
                "SELECT * FROM fn_analytics_daily_activity(@UserId);";

            var result = await connection.QueryAsync<DailyActivityResponse>(
                new CommandDefinition(
                    sql,
                    new { UserId = userId },
                    cancellationToken: cancellationToken));

            return result.ToList();
        });
    }
}