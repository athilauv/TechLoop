using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class UserTopicProgressRepository : IUserTopicProgressRepository
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

    public UserTopicProgressRepository(IDapperContext context)
    {
        _context = context;
    }

    public Task<UserTopicProgress?> GetByUserAndTopicAsync(
        Guid userId,
        int topicId,
        CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_user_topic_progress(@UserId, @TopicId);";

        

            return await connection.QuerySingleOrDefaultAsync<UserTopicProgress>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        UserId = userId,
                        TopicId = topicId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<Guid> CreateAsync(
        UserTopicProgress progress,
        CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"
                CALL sp_manage_user_topic_progress(
                    'CREATE',
                    @UserId,
                    @TopicId,
                    @CompletedQuestions,
                    @LastPracticedAt,
                    @CreatedAt,
                    @UpdatedAt,
                    NULL
                );";

        

            await connection.ExecuteAsync(
                new CommandDefinition(
                    sql,
                    new
                    {
                        progress.UserId,
                        progress.TopicId,
                        progress.CompletedQuestions,
                        progress.LastPracticedAt,
                        progress.CreatedAt,
                        progress.UpdatedAt
                    },
                    cancellationToken: cancellationToken));

            var created = await GetByUserAndTopicAsync(
                progress.UserId,
                progress.TopicId,
                cancellationToken);

            if (created is null)
            {
                throw new InvalidOperationException(
                    "Unable to create user topic progress.");
            }

            return created.Id;
    
    });
    }

    public Task<int> UpdateAsync(
        UserTopicProgress progress,
        CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"
                CALL sp_manage_user_topic_progress(
                    'UPDATE',
                    @UserId,
                    @TopicId,
                    @CompletedQuestions,
                    @LastPracticedAt,
                    NULL,
                    @UpdatedAt,
                    NULL
                );";

        

            return await connection.ExecuteAsync(
                new CommandDefinition(
                    sql,
                    new
                    {
                        progress.UserId,
                        progress.TopicId,
                        progress.CompletedQuestions,
                        progress.LastPracticedAt,
                        progress.UpdatedAt
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<IEnumerable<UserTopicProgress>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql =
                @"SELECT * FROM fn_get_user_topic_progress_list(@UserId);";

        

            return await connection.QueryAsync<UserTopicProgress>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        UserId = userId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }
}
