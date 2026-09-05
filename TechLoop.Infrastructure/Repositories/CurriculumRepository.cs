using Dapper;
using TechLoop.Application.Features.Curriculum.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Infrastructure.Repositories;

public sealed class CurriculumRepository : ICurriculumRepository
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

    public CurriculumRepository(IDapperContext context) => _context = context;
    public Task<MentorCurriculumResponse?> GetMentorCurriculumAsync(Guid userId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            var rows = (await connection.QueryAsync<CurriculumRowResponse>(
                new CommandDefinition("SELECT * FROM fn_get_mentor_curriculum(@UserId);",
                    new { UserId = userId }, cancellationToken: cancellationToken))).ToList();

            return BuildMentorResponse(rows);
    
    });
    }

    public Task<LearnerCurriculumResponse?> GetLearnerCurriculumAsync(int technologyId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            var rows = (await connection.QueryAsync<CurriculumRowResponse>(
                new CommandDefinition("SELECT * FROM fn_get_learner_curriculum(@TechnologyId);",
                    new { TechnologyId = technologyId },
                    cancellationToken: cancellationToken))).ToList();

            return BuildLearnerResponse(rows);
    
    });
    }

    private static MentorCurriculumResponse? BuildMentorResponse(IReadOnlyList<CurriculumRowResponse> rows)
    {
        if (rows.Count == 0)
            return null;

        var first = rows[0];
        var topics = new Dictionary<int, CurriculumTopicResponse>();

        foreach (var row in rows)
        {
            if (!row.TopicId.HasValue)
                continue;

            if (!topics.TryGetValue(row.TopicId.Value, out var topic))
            {
                topic = new CurriculumTopicResponse
                {
                    Id = row.TopicId.Value,
                    Title = row.TopicTitle!,
                    Slug = row.TopicSlug!,
                    Position = row.TopicPosition!.Value,
                    CreatedAt = row.TopicCreatedAt!.Value,
                    UpdatedAt = row.TopicUpdatedAt,
                    PublishedAt = row.TopicPublishedAt,
                    SubTopics = new List<CurriculumSubTopicResponse>()
                };
                topics.Add(topic.Id, topic);
            }

            if (row.SubTopicId.HasValue)
            {
                topic.SubTopics.Add(new CurriculumSubTopicResponse
                {
                    Id = row.SubTopicId.Value,
                    TopicId = row.TopicId.Value,
                    ParentSubTopicId = row.ParentSubTopicId,
                    Title = row.SubTopicTitle!,
                    Slug = row.SubTopicSlug!,
                    Position = row.SubTopicPosition!.Value,
                    CreatedAt = row.SubTopicCreatedAt!.Value,
                    UpdatedAt = row.SubTopicUpdatedAt,
                    PublishedAt = row.SubTopicPublishedAt
                });
            }
        }

        return new MentorCurriculumResponse
        {
            TechnologyId = first.TechnologyId,
            TechnologyName = first.TechnologyName,
            Topics = topics.Values.ToList()
        };
    }

    private static LearnerCurriculumResponse? BuildLearnerResponse(IReadOnlyList<CurriculumRowResponse> rows)
    {
        if (rows.Count == 0)
            return null;

        var first = rows[0];
        var topics = new Dictionary<int, CurriculumTopicResponse>();

        foreach (var row in rows)
        {
            if (!row.TopicId.HasValue)
                continue;

            if (!topics.TryGetValue(row.TopicId.Value, out var topic))
            {
                topic = new CurriculumTopicResponse
                {
                    Id = row.TopicId.Value,
                    Title = row.TopicTitle!,
                    Slug = row.TopicSlug!,
                    Position = row.TopicPosition!.Value,
                    CreatedAt = row.TopicCreatedAt!.Value,
                    UpdatedAt = row.TopicUpdatedAt,
                    PublishedAt = null,
                    SubTopics = new List<CurriculumSubTopicResponse>()
                };
                topics.Add(topic.Id, topic);
            }

            if (row.SubTopicId.HasValue)
            {
                topic.SubTopics.Add(new CurriculumSubTopicResponse
                {
                    Id = row.SubTopicId.Value,
                    TopicId = row.TopicId.Value,
                    ParentSubTopicId = row.ParentSubTopicId,
                    Title = row.SubTopicTitle!,
                    Slug = row.SubTopicSlug!,
                    Position = row.SubTopicPosition!.Value,
                    CreatedAt = row.SubTopicCreatedAt!.Value,
                    UpdatedAt = row.SubTopicUpdatedAt,
                    PublishedAt = null
                });
            }
        }

        return new LearnerCurriculumResponse
        {
            TechnologyId = first.TechnologyId,
            TechnologyName = first.TechnologyName,
            Topics = topics.Values.ToList()
        };
    }
}
