using Dapper;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class TopicRepository : ITopicsRepository
{
    private readonly IDapperContext _context;
    public TopicRepository(IDapperContext context)
    {
        _context = context;
    }

    // Check whether a topic with the same title already exists.
    public async Task<bool> ExistsAsync(int technologyId, string title, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                "SELECT fn_topic_exists(@TechnologyId,@Title);",
                new
                {
                    TechnologyId = technologyId,
                    Title = title
                },
                cancellationToken: cancellationToken));
    }

    // Check whether the topic slug already exists.
    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                "SELECT fn_topic_slug_exists(@Slug);",
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }

    // Check whether the position already exists within the technology.
    public async Task<bool> PositionExistsAsync(int technologyId, int position, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                "SELECT fn_topic_position_exists(@TechnologyId,@Position);",
                new
                {
                    TechnologyId = technologyId,
                    Position = position
                },
                cancellationToken: cancellationToken));
    }

    // Check whether the technology exists.
    public async Task<bool> TechnologyExistsAsync(int technologyId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                "SELECT fn_topic_technology_exists(@TechnologyId);",
                new
                {
                    TechnologyId = technologyId
                },
                cancellationToken: cancellationToken));
    }

    // Create a new topic.
    public async Task<int> CreateAsync(Topic topic, bool shiftPositions, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(
                @"
                SELECT fn_create_topic(
                    @TechnologyId,
                    @Title,
                    @Slug,
                    @Description,
                    @ImageUrl,
                    @Example,
                    @ExampleType,
                    @Position,
                    @CreatedBy,
                    @CreatedAt,
                    @ShiftPositions
                );",
                new
                {
                    topic.TechnologyId,
                    topic.Title,
                    topic.Slug,
                    topic.Description,
                    topic.ImageUrl,
                    topic.Example,
                    topic.ExampleType,
                    topic.Position,
                    topic.CreatedBy,
                    topic.CreatedAt,
                    ShiftPositions = shiftPositions
                },
                cancellationToken: cancellationToken));
    }
    

    // Get a topic by its ID.
    public async Task<Topic?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Topic>(
            new CommandDefinition(
                "SELECT * FROM fn_get_topic_by_id(@Id);",
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }

    
    // Update an existing topic.
    public async Task<int> UpdateAsync(
        Topic topic,
        bool shiftPositions,
        CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();

        return await connection.ExecuteAsync(
            new CommandDefinition(
                @"
                CALL sp_update_topic(
                    @Id,
                    @TechnologyId,
                    @Title,
                    @Slug,
                    @Description,
                    @ImageUrl,
                    @Example,
                    @ExampleType,
                    @Position,
                    @UpdatedBy,
                    @UpdatedAt,
                    @ShiftPositions
                );",
                new
                {
                    topic.Id,
                    topic.TechnologyId,
                    topic.Title,
                    topic.Slug,
                    topic.Description,
                    topic.ImageUrl,
                    topic.Example,
                    topic.ExampleType,
                    topic.Position,
                    topic.UpdatedBy,
                    topic.UpdatedAt,
                    ShiftPositions = shiftPositions
                },
                cancellationToken: cancellationToken));
    }
    

    // Soft delete a topic.
    public async Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(
            new CommandDefinition(
                @"CALL sp_soft_delete_topic(@Id, @DeletedBy, @DeletedAt);",
                new
                {
                    Id = id,
                    DeletedBy = deletedBy,
                    DeletedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));
    }
    
    // Get all active topics.
    public async Task<IEnumerable<Topic>> GetAllAsync(CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Topic>(
            new CommandDefinition(
                "SELECT * FROM fn_get_all_topics();",
                cancellationToken: cancellationToken));
    }

    // Publish a topic.
    public async Task<int> PublishAsync(Topic topic, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();

        return await connection.ExecuteAsync(
            new CommandDefinition(
                """
                CALL sp_publish_topic(
                    @Id,
                    @PublishedBy,
                    @PublishedAt
                );
                """,
                topic,
                cancellationToken: cancellationToken));
    }
    
    
    // Get all published topics.
    public async Task<IEnumerable<Topic>> GetPublishedAsync(CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Topic>(
            new CommandDefinition("SELECT * FROM fn_get_published_topics();", cancellationToken: cancellationToken));
    }
    

    // Get a published topic by its slug.
    public async Task<Topic?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Topic>(new CommandDefinition(
                "SELECT * FROM fn_get_published_topic_by_slug(@Slug);",
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }
    
    public async Task<int?> GetTechnologyIdAsync(int topicId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int?>(new CommandDefinition("SELECT fn_get_topic_technology(@TopicId);",
                new
                {
                    TopicId = topicId
                },
                cancellationToken: cancellationToken));
    }

    public async Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int?>(new CommandDefinition("SELECT fn_get_mentor_technology(@UserId);",
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }
    
    public async Task<IEnumerable<MentorTopicResponse>>
        GetUnpublishedTopicsForMentorAsync(Guid mentorId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_mentor_unpublished_topics(@MentorId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<MentorTopicResponse>(new CommandDefinition(sql,
                new
                {
                    MentorId = mentorId
                },
                cancellationToken: cancellationToken));
    }
}
    