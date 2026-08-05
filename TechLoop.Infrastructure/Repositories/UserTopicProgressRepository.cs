using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class UserTopicProgressRepository : IUserTopicProgressRepository
{
    private readonly IDapperContext _context;

    public UserTopicProgressRepository(IDapperContext context)
    {
        _context = context;
    }

    public async Task<UserTopicProgress?> GetByUserAndTopicAsync(Guid userId, int topicId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_user_topic_progress( @UserId, @TopicId);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<UserTopicProgress>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId,
                    TopicId = topicId
                },
                cancellationToken: cancellationToken));
    }

    public async Task<Guid> CreateAsync(UserTopicProgress progress, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_user_topic_progress( @UserId, @TopicId, @CompletedQuestions, @LastPracticedAt, @CreatedAt, @UpdatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<Guid>(
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
    }

    public async Task<int> UpdateAsync(UserTopicProgress progress, CancellationToken cancellationToken)
    {
        const string sql = @" CALL sp_update_user_topic_progress( @Id, @CompletedQuestions, @LastPracticedAt, @UpdatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(sql,
                new
                {
                    progress.Id,
                    progress.CompletedQuestions,
                    progress.LastPracticedAt,
                    UpdatedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));
    }
    
    public async Task<IEnumerable<UserTopicProgress>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_user_topic_progress_list(@UserId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<UserTopicProgress>(new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }
}