using Dapper;
using TechLoop.Application.Features.Curriculum.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Infrastructure.Repositories;

public sealed class CurriculumRepository : ICurriculumRepository
{
    private readonly IDapperContext _context;

    public CurriculumRepository(IDapperContext context)
    {
        _context = context;
    }

    public async Task<MentorCurriculumResponse?> GetMentorCurriculumAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();

        var rows = (await connection.QueryAsync<CurriculumRowResponse>(
            @"SELECT * FROM fn_get_mentor_curriculum(@UserId);"
            ,
            new {
                UserId = userId
            }))
            .ToList();

        if (!rows.Any())
            return null;

        var response = new MentorCurriculumResponse
        {
            TechnologyId = rows.First().TechnologyId,
            TechnologyName = rows.First().TechnologyName
        };

        response.Topics = rows
            .Where(x => x.TopicId.HasValue)
            .GroupBy(x => x.TopicId!.Value)
            .Select(group =>
            {
                var first = group.First();

                return new CurriculumTopicResponse
                {
                    Id = first.TopicId.Value,
                    Title = first.TopicTitle!,
                    Slug = first.TopicSlug!,
                    Position = first.TopicPosition!.Value,
                    CreatedAt = first.TopicCreatedAt!.Value,
                    UpdatedAt = first.TopicUpdatedAt,
                    PublishedAt = first.TopicPublishedAt,
                    //subtopic
                    SubTopics = OrderSubTopics(
                        group
                            .Where(x => x.SubTopicId.HasValue)
                            .Select(x => new CurriculumSubTopicResponse
                            {
                                Id = x.SubTopicId!.Value,
                                TopicId = x.TopicId!.Value,
                                ParentSubTopicId = x.ParentSubTopicId,
                                Title = x.SubTopicTitle!,
                                Slug = x.SubTopicSlug!,
                                Position = x.SubTopicPosition!.Value,
                                CreatedAt = x.SubTopicCreatedAt!.Value,
                                UpdatedAt = x.SubTopicUpdatedAt,
                                PublishedAt = x.SubTopicPublishedAt
                            })
                            .ToList()
                    )
                };
            })
            .OrderBy(x => x.Position)
            .ToList();

        return response;
    }

    public async Task<LearnerCurriculumResponse?> GetLearnerCurriculumAsync(
        int technologyId,
        CancellationToken cancellationToken)
    {
        using var connection = _context.CreateConnection();

        var rows = (await connection.QueryAsync<CurriculumRowResponse>(
            @"SELECT * FROM fn_get_learner_curriculum(@TechnologyId);",
            new
            {
                TechnologyId = technologyId
            }))
            .ToList();

        if (!rows.Any())
            return null;

        var response = new LearnerCurriculumResponse
        {
            TechnologyId = rows.First().TechnologyId,
            TechnologyName = rows.First().TechnologyName
        };

        response.Topics = rows
            .Where(x => x.TopicId.HasValue)
            .GroupBy(x => x.TopicId!.Value)
            .Select(group =>
            {
                var first = group.First();

                return new CurriculumTopicResponse
                {
                    Id = first.TopicId.Value,
                    Title = first.TopicTitle!,
                    Slug = first.TopicSlug!,
                    Position = first.TopicPosition!.Value,
                    CreatedAt = first.TopicCreatedAt!.Value,
                    UpdatedAt = first.TopicUpdatedAt,
                    PublishedAt = null,
                    //subtopic
                    SubTopics = OrderSubTopics(
                        group
                            .Where(x => x.SubTopicId.HasValue)
                            .Select(x => new CurriculumSubTopicResponse
                            {
                                Id = x.SubTopicId!.Value,
                                TopicId = x.TopicId!.Value,
                                ParentSubTopicId = x.ParentSubTopicId,
                                Title = x.SubTopicTitle!,
                                Slug = x.SubTopicSlug!,
                                Position = x.SubTopicPosition!.Value,
                                CreatedAt = x.SubTopicCreatedAt!.Value,
                                UpdatedAt = x.SubTopicUpdatedAt,
                                PublishedAt = null
                            })
                            .ToList()
                    )
                };
            })
            .OrderBy(x => x.Position)
            .ToList();

        return response;
    }
    
    
    private static List<CurriculumSubTopicResponse> OrderSubTopics(
        List<CurriculumSubTopicResponse> subTopics)
    {
        var ordered = new List<CurriculumSubTopicResponse>();

        void AddSubTopic(CurriculumSubTopicResponse subTopic)
        {
            ordered.Add(subTopic);

            var children = subTopics
                .Where(x => x.ParentSubTopicId == subTopic.Id)
                .OrderBy(x => x.Position);

            foreach (var child in children)
            {
                AddSubTopic(child);
            }
        }

        var rootSubTopics = subTopics
            .Where(x => x.ParentSubTopicId == null)
            .OrderBy(x => x.Position);

        foreach (var root in rootSubTopics)
        {
            AddSubTopic(root);
        }

        return ordered;
    }
}