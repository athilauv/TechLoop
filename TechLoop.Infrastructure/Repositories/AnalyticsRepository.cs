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

    public async Task<AnalyticsOverviewResponse?> GetOverviewAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_analytics_overview(@UserId);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<AnalyticsOverviewResponse>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }

    public async Task<IReadOnlyList<PracticeActivityResponse>> GetPracticeActivityAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_analytics_practice_activity(@UserId);";
        using var connection = _context.CreateConnection();
        var result = await connection.QueryAsync<PracticeActivityResponse>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));

        return result.ToList();
    }

    public async Task<IReadOnlyList<TechnologyPracticeResponse>> GetTechnologyPracticeAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_analytics_technology_practice(@UserId);";
        using var connection = _context.CreateConnection();
        var result = await connection.QueryAsync<TechnologyPracticeResponse>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));

        return result.ToList();
    }

    public async Task<IReadOnlyList<TopicAnalyticsResponse>> GetTopicAnalyticsAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_analytics_topic(@UserId);";
        using var connection = _context.CreateConnection();
        var result = await connection.QueryAsync<TopicAnalyticsResponse>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));

        return result.ToList();
    }

    public async Task<IReadOnlyList<DifficultyProgressionResponse>> GetDifficultyProgressionAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_analytics_difficulty(@UserId);";
        using var connection = _context.CreateConnection();
        var result = await connection.QueryAsync<DifficultyProgressionResponse>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));

        return result.ToList();
    }

    public async Task<IReadOnlyList<DailyActivityResponse>> GetDailyActivityAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_analytics_daily_activity(@UserId);";
        using var connection = _context.CreateConnection();
        var result = await connection.QueryAsync<DailyActivityResponse>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));

        return result.ToList();
    }
}
