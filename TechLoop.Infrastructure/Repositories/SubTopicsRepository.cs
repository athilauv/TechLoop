using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public class SubTopicsRepository : ISubTopicsRepository
{
    private readonly IDapperContext _context;
    public SubTopicsRepository(IDapperContext context)
    {
        _context = context;
    }

    // Checks whether a subtopic exists by its ID.
    public async Task<bool> SubTopicIdExistsAsync(int subTopicId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_subtopic_id_exists(@SubTopicId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                sql,
                new
                {
                    SubTopicId = subTopicId
                },
                cancellationToken: cancellationToken));
    }
    
    // Checks if a subtopic with the same title already exists
    public async Task<bool> ExistsAsync(int topicId, string title, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_subtopic_exists(@TopicId, @Title);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    TopicId = topicId,
                    Title = title
                },
                cancellationToken: cancellationToken));
    }

    // Checks if the specified slug already exists
    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_subtopic_slug_exists(@Slug);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }

    // Checks if the specified position is already assigned within the topic
    public async Task<bool> PositionExistsAsync(int topicId, int position, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_subtopic_position_exists(@TopicId, @Position);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    TopicId = topicId,
                    Position = position
                },
                cancellationToken: cancellationToken));
    }

    // Checks if the specified topic exists
    public async Task<bool> TopicExistsAsync(int topicId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_subtopic_topic_exists(@TopicId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    TopicId = topicId
                },
                cancellationToken: cancellationToken));
    }

    // Creates a new subtopic and returns the generated ID
    public async Task<int> CreateAsync(SubTopic subTopic, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_subtopic( @TopicId,@Slug,@Title,@Description,@ImageUrl,@Position,@CreatedBy,@CreatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql, subTopic, cancellationToken: cancellationToken));
    }

    // Retrieves a subtopic by its ID
    public async Task<SubTopic?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_subtopic_by_id(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<SubTopic>(
            new CommandDefinition(
                sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }

    // Updates the specified subtopic
    public async Task<int> UpdateAsync(SubTopic subTopic, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_update_subtopic(@Id,@TopicId,@Title,@Slug,@Description,@ImageUrl,@Position,@UpdatedBy,@UpdatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(sql, subTopic, cancellationToken: cancellationToken));
    }

    // Soft deletes the specified subtopic
    public async Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_soft_delete_subtopic(@Id, @DeletedBy, @DeletedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    Id = id,
                    DeletedBy = deletedBy,
                    DeletedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));
    }

    // Retrieves all active subtopics
    public async Task<IEnumerable<SubTopic>> GetAllAsync(CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_all_subtopics();";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<SubTopic>(new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    // Publishes the specified subtopic
    public async Task<int> PublishAsync(SubTopic subTopic, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_publish_subtopic(@Id,@PublishedBy,@PublishedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    subTopic.Id,
                    subTopic.PublishedBy,
                    subTopic.PublishedAt
                },
                cancellationToken: cancellationToken));
    }

    // Retrieves all published subtopics
    public async Task<IEnumerable<SubTopic>> GetPublishedAsync(CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_subtopics();";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<SubTopic>(new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    // Retrieves a published subtopic by its slug
    public async Task<SubTopic?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_subtopic_by_slug(@Slug);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<SubTopic>(
            new CommandDefinition(sql,
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }
}