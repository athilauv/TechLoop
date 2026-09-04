using Dapper;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class SubTopicsRepository : ISubTopicsRepository
{
    private readonly IDapperContext _context;

    public SubTopicsRepository(IDapperContext context)
    {
        _context = context;
    }

    // Check whether a subtopic already exists.
    public async Task<bool> SubTopicIdExistsAsync(int subTopicId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition("SELECT fn_subtopic_id_exists(@SubTopicId);",
                new
                {
                    SubTopicId = subTopicId
                },
                cancellationToken: cancellationToken));
    }

    // Check whether a subtopic with the same slug already exists within the topic.
    public async Task<bool> ExistsAsync(int topicId, string slug, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition("SELECT fn_subtopic_exists(@TopicId,@Slug);",
                new
                {
                    TopicId = topicId,
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }

    // Check whether the subtopic slug already exists.
    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition("SELECT fn_subtopic_slug_exists(@Slug);",
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }

    // Check whether the position already exists within the topic.
    public async Task<bool> PositionExistsAsync( int topicId, int position, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();

        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition("SELECT fn_subtopic_position_exists(@TopicId,@Position);",
                new
                {
                    TopicId = topicId,
                    Position = position
                },
                cancellationToken: cancellationToken));
    }

    // Create a new subtopic.
    public async Task<int> CreateAsync(SubTopic subTopic, bool shiftPositions, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();

        await connection.ExecuteAsync(
            new CommandDefinition(
                @"CALL public.sp_manage_subtopic(
                    'CREATE',
                    NULL,
                    @TopicId,
                    @ParentSubTopicId,
                    @Slug,
                    @Title,
                    @Description,
                    @ImageUrl,
                    @Example,
                    @ExampleType,
                    @Position,
                    @CreatedBy,
                    NULL,
                    NULL,
                    NULL,
                    @ShiftPositions);",
                new
                {
                    subTopic.TopicId,
                    subTopic.ParentSubTopicId,
                    subTopic.Slug,
                    subTopic.Title,
                    subTopic.Description,
                    subTopic.ImageUrl,
                    subTopic.Example,
                    subTopic.ExampleType,
                    subTopic.Position,
                    subTopic.CreatedBy,
                    ShiftPositions = shiftPositions
                },
                cancellationToken: cancellationToken));

        return 1;
    }

    // Update an existing subtopic.
    public async Task<int> UpdateAsync(SubTopic subTopic, bool shiftPositions, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();

        await connection.ExecuteAsync(
            new CommandDefinition(
                @"CALL public.sp_manage_subtopic(
                    'UPDATE',
                    @Id,
                    @TopicId,
                    @ParentSubTopicId,
                    @Slug,
                    @Title,
                    @Description,
                    @ImageUrl,
                    @Example,
                    @ExampleType,
                    @Position,
                    NULL,
                    @UpdatedBy,
                    NULL,
                    NULL,
                    @ShiftPositions);",
                new
                {
                    subTopic.Id,
                    subTopic.TopicId,
                    subTopic.ParentSubTopicId,
                    subTopic.Slug,
                    subTopic.Title,
                    subTopic.Description,
                    subTopic.ImageUrl,
                    subTopic.Example,
                    subTopic.ExampleType,
                    subTopic.Position,
                    subTopic.UpdatedBy,
                    ShiftPositions = shiftPositions
                },
                cancellationToken: cancellationToken));

        return 1;
    }

    // Soft delete a subtopic.
    public async Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            @"CALL public.sp_manage_subtopic(
                'DELETE', @Id, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
                NULL, NULL, @DeletedBy, NULL, FALSE);",
            new { Id = id, DeletedBy = deletedBy },
            cancellationToken: cancellationToken));

        return 1;
    }
    
    // Check whether the topic exists.
    public async Task<bool> TopicExistsAsync(int topicId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition("SELECT fn_subtopic_topic_exists(@TopicId);",
                new
                {
                    TopicId = topicId
                },
                cancellationToken: cancellationToken));
    }

    // Publish a subtopic.
    public async Task<int> PublishAsync(SubTopic subTopic, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            @"CALL public.sp_manage_subtopic(
                'PUBLISH', @Id, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
                NULL, NULL, NULL, @PublishedBy, FALSE);",
            new { subTopic.Id, PublishedBy = subTopic.PublishedBy },
            cancellationToken: cancellationToken));

        return 1;
    }

    // Get a subtopic by its ID.
    public async Task<SubTopic?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<SubTopic>(
            new CommandDefinition("SELECT * FROM fn_get_subtopic_by_id(@Id);",
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }

    public async Task<MentorSubTopicResponse?> GetMentorByIdAsync(int id, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<MentorSubTopicResponse>(
            new CommandDefinition(
                "SELECT * FROM fn_get_mentor_subtopic_by_id(@Id);",
                new { Id = id },
                cancellationToken: cancellationToken));
    }

    // Get all active subtopics.
    public async Task<IEnumerable<SubTopic>> GetAllAsync(CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<SubTopic>(
            new CommandDefinition("SELECT * FROM fn_get_all_subtopics();",
                cancellationToken: cancellationToken));
    }

    public async Task<IEnumerable<MentorSubTopicResponse>> GetAllMentorAsync(Guid mentorId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<MentorSubTopicResponse>(
            new CommandDefinition(
                "SELECT * FROM fn_get_mentor_subtopics(@MentorId);",
                new { MentorId = mentorId },
                cancellationToken: cancellationToken));
    }

    // Get all published subtopics.
    public async Task<IEnumerable<SubTopic>> GetPublishedAsync(CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<SubTopic>(
            new CommandDefinition("SELECT * FROM fn_get_published_subtopics();",
                cancellationToken: cancellationToken));
    }

    // Get a published subtopic by its slug.
    public async Task<SubTopic?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<SubTopic>(
            new CommandDefinition(
                "SELECT * FROM fn_get_published_subtopic_by_slug(@Slug);",
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }

    // Get the technology ID associated with the subtopic.
    public async Task<int?> GetTechnologyIdAsync(int subTopicId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int?>(
            new CommandDefinition("SELECT fn_get_subtopic_technology(@SubTopicId);",
                new
                {
                    SubTopicId = subTopicId
                },
                cancellationToken: cancellationToken));
    }

    // Get the technology ID associated with the mentor.
    public async Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();

        return await connection.ExecuteScalarAsync<int?>(
            new CommandDefinition("SELECT fn_get_mentor_technology(@UserId);",
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }

    // Get the topic ID associated with the subtopic.
    public async Task<int> GetTopicIdAsync(int subTopicId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(
            new CommandDefinition("SELECT fn_get_topic_id(@SubTopicId);",
                new
                {
                    SubTopicId = subTopicId
                },
                cancellationToken: cancellationToken));
    }

    // Get unpublished subtopics for a mentor.
    public async Task<IEnumerable<MentorSubTopicResponse>>
        GetUnpublishedSubTopicsForMentorAsync(Guid mentorId, CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<MentorSubTopicResponse>(
            new CommandDefinition(
                "SELECT * FROM fn_get_mentor_unpublished_subtopic_details(@MentorId);",
                new { MentorId = mentorId },
                cancellationToken: cancellationToken));
    }
}
