using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Topics.Queries.GetAllTopics.Learner;

public sealed class GetAllLearnerTopicsQueryHandler : IRequestHandler<GetAllLearnerTopicsQuery, IEnumerable<LearnerTopicResponse>>
{
    private readonly ITopicsRepository _repository;
    private readonly ICacheService _cache;

    public GetAllLearnerTopicsQueryHandler(ITopicsRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<IEnumerable<LearnerTopicResponse>> Handle(GetAllLearnerTopicsQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<List<LearnerTopicResponse>>(CacheKeys.Topics);
        if (cached is not null)
        {
            Console.WriteLine("[CACHE] Get All Topics - HIT");
            return cached;
        }

        Console.WriteLine("[CACHE] Get All Topics - MISS");

        var topics = await _repository.GetPublishedAsync(cancellationToken);
        var result = topics.Select(topic => new LearnerTopicResponse
        {
            Id = topic.Id,
            TechnologyId = topic.TechnologyId,
            Title = topic.Title,
            Slug = topic.Slug,
            Description = topic.Description,
            ImageUrl = topic.ImageUrl,
            Example = topic.Example,
            ExampleType = topic.ExampleType,
            Position = topic.Position,
            CreatedAt = topic.CreatedAt,
            UpdatedAt = topic.UpdatedAt
        }).ToList();

        await _cache.SetAsync(CacheKeys.Topics, result, TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get All Topics - STORED");
        return result;
    }
}
