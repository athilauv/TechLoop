using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class UserStatisticsRepository : IUserStatisticsRepository
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

    public UserStatisticsRepository(IDapperContext context)
    {
        _context = context;
    }

    public Task<UserStatistics?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_user_statistics(@UserId);";
        
            return await connection.QuerySingleOrDefaultAsync<UserStatistics>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        UserId = userId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<Guid> CreateAsync(UserStatistics statistics, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_manage_user_statistics('CREATE', NULL, @UserId, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);";
        
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
    
    });
    }

    public Task<int> UpdateAsync(UserStatistics statistics, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_manage_user_statistics('UPDATE', @Id, NULL, @ReputationPoints, @QuestionsSolved, @McqSolved, @CodingSolved, @TotalSubmissions, @AcceptedSubmissions, @FailedSubmissions, @TotalTimeSpentMinutes);";
        
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
    
    });
    }

    public Task UpdateMcqStatisticsAsync(Guid userId, bool isCorrect, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}