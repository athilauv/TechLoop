using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.SubTopics.Queries.GetAllSubTopics.Learner;

public sealed class GetAllLearnerSubTopicsQueryHandler : IRequestHandler<GetAllLearnerSubTopicsQuery, IEnumerable<LearnerSubTopicResponse>>
{
    private readonly ISubTopicsRepository _repository;
    private readonly ICacheService _cache;

    public GetAllLearnerSubTopicsQueryHandler(ISubTopicsRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<IEnumerable<LearnerSubTopicResponse>> Handle(GetAllLearnerSubTopicsQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<List<LearnerSubTopicResponse>>(CacheKeys.SubTopics);
        if (cached is not null)
        {
            Console.WriteLine("[CACHE] Get All SubTopics - HIT");
            return cached;
        }

        Console.WriteLine("[CACHE] Get All SubTopics - MISS");

        var subTopics = await _repository.GetPublishedAsync(cancellationToken);
        var result = subTopics.Select(subTopic => new LearnerSubTopicResponse
        {
            Id = subTopic.Id,
            TopicId = subTopic.TopicId,
            Title = subTopic.Title,
            Slug = subTopic.Slug,
            Description = subTopic.Description,
            ImageUrl = subTopic.ImageUrl,
            Example = subTopic.Example,
            ExampleType = subTopic.ExampleType,
            Position = subTopic.Position,
            CreatedAt = subTopic.CreatedAt,
            UpdatedAt = subTopic.UpdatedAt
        }).ToList();

        await _cache.SetAsync(CacheKeys.SubTopics, result, TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get All SubTopics - STORED");
        return result;
    }
}
