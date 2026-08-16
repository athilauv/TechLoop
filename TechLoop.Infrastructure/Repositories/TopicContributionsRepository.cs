using Dapper;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Infrastructure.Repositories;

public sealed class TopicContributionRepository : ITopicContributionRepository
{
    private readonly IDapperContext _context;

    public TopicContributionRepository(IDapperContext context)
    {
        _context = context;
    }

    // Checks whether the specified technology exists
    public async Task<bool> TechnologyExistsAsync(int technologyId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_topic_contribution_technology_exists(@TechnologyId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                new
                {
                    TechnologyId = technologyId
                },
                cancellationToken: cancellationToken));
    }

    // Creates a new topic contribution
    public async Task<int> CreateAsync(Guid learnerId, int technologyId, int? topicId,
        int? subTopicId, string title, string description, string? example, short? exampleType,
        string? referenceUrl, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_topic_contribution(@LearnerId, @TechnologyId, @TopicId,
    @SubTopicId, @Title,@Description, @Example, @ExampleType, @ReferenceUrl);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(
                sql,
                new
                {
                    LearnerId = learnerId,
                    TechnologyId = technologyId,
                    TopicId = topicId,
                    SubTopicId = subTopicId,
                    Title = title,
                    Description = description,
                    Example = example,
                    ExampleType = exampleType,
                    ReferenceUrl = referenceUrl
                },
                cancellationToken: cancellationToken));
    }

    // Reviews a contribution
    public async Task<bool> ReviewAsync(int contributionId, short status, string? reviewNotes, int? position, int? parentSubTopicId, Guid reviewedBy, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_review_topic_contribution( @ContributionId, @Status, @ReviewNotes, @Position, @ParentSubTopicId, @ReviewedBy, @ReviewedAt);";
        using var connection = _context.CreateConnection();
        var rows = await connection.ExecuteAsync(
            new CommandDefinition(sql,
                new
                {
                    ContributionId = contributionId,
                    Status = status,
                    ReviewNotes = reviewNotes,
                    Position = position,
                    ParentSubTopicId = parentSubTopicId,
                    ReviewedBy = reviewedBy,
                    ReviewedAt = DateTime.UtcNow
                }, 
                cancellationToken: cancellationToken));

        return rows > 0;
    }

    // Gets all contributions created by a learner
    public async Task<IEnumerable<TopicContributionSummaryResponse>>
        GetMyContributionsAsync(Guid learnerId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_my_topic_contributions(@LearnerId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<TopicContributionSummaryResponse>(new CommandDefinition(
                sql,
                new
                {
                    LearnerId = learnerId
                },
                cancellationToken: cancellationToken));
    }

    // Gets contributions for a technology
    public async Task<IEnumerable<TopicContributionResponse>>
        GetTechnologyContributionsAsync(
            int technologyId,
            CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_technology_topic_contributions(@TechnologyId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<TopicContributionResponse>(new CommandDefinition(
                sql,
                new
                {
                    TechnologyId = technologyId
                },
                cancellationToken: cancellationToken));
    }

    // Gets a contribution by ID
    public async Task<TopicContributionResponse?> GetByIdAsync(
        int contributionId,
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_topic_contribution_by_id(@ContributionId);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<TopicContributionResponse>(new CommandDefinition(
                sql,
                new
                {
                    ContributionId = contributionId
                },
                cancellationToken: cancellationToken));
    }
    
    // Retrieves a contribution created by the specified learner
    public async Task<TopicContributionResponse?> GetMyContributionByIdAsync(Guid learnerId, int contributionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_my_topic_contribution_by_id(@LearnerId, @ContributionId);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<TopicContributionResponse>(new CommandDefinition(
                sql,
                new
                {
                    LearnerId = learnerId,
                    ContributionId = contributionId
                },
                cancellationToken: cancellationToken));
    }
    
    public async Task<IEnumerable<TopicContributionPendingResponse>>
        GetPendingContributionsAsync(Guid mentorId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_pending_topic_contributions(@MentorId); " ;
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<TopicContributionPendingResponse>(new CommandDefinition(sql,
                new
                {
                    MentorId = mentorId
                },
                cancellationToken: cancellationToken));
    }
    
    public async Task<TopicContributionResponse?>
        GetMentorContributionByIdAsync(Guid mentorId, int contributionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_mentor_topic_contribution_by_id( @MentorId, @ContributionId);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<TopicContributionResponse>(new CommandDefinition(sql,
                new
                {
                    MentorId = mentorId,
                    ContributionId = contributionId
                },
                cancellationToken: cancellationToken));
    }
}