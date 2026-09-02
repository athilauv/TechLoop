using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class UserStatisticsRepository : IUserStatisticsRepository
{
    private readonly IDapperContext _context;

    public UserStatisticsRepository(IDapperContext context)
    {
        _context = context;
    }

    public async Task<UserStatistics?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_user_statistics(@UserId);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<UserStatistics>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }

    public async Task<Guid> CreateAsync(UserStatistics statistics, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_manage_user_statistics('CREATE', NULL, @UserId, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);";
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
                sql,
                new
                {
                    statistics.UserId
                },
                cancellationToken: cancellationToken));

        var created = await GetByUserIdAsync(statistics.UserId, cancellationToken);
        if (created is null)
        {
            throw new InvalidOperationException("Unable to create user statistics.");
        }

        return created.Id;
    }

    public async Task<int> UpdateAsync(UserStatistics statistics, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_manage_user_statistics('UPDATE', @Id, NULL, @ReputationPoints, @QuestionsSolved, @McqSolved, @CodingSolved, @TotalSubmissions, @AcceptedSubmissions, @FailedSubmissions, @TotalTimeSpentMinutes);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(
                sql,
                new
                {
                    statistics.Id,
                    statistics.ReputationPoints,
                    statistics.QuestionsSolved,
                    statistics.McqSolved,
                    statistics.CodingSolved,
                    statistics.TotalSubmissions,
                    statistics.AcceptedSubmissions,
                    statistics.FailedSubmissions,
                    statistics.TotalTimeSpentMinutes
                },
                cancellationToken: cancellationToken));
    }

    public Task UpdateMcqStatisticsAsync(Guid userId, bool isCorrect, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}