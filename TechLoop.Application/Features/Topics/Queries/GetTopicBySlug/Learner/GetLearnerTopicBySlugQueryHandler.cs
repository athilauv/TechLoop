using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Topics.Queries.GetTopicBySlug.Learner;

public sealed class GetLearnerTopicBySlugQueryHandler : IRequestHandler<GetLearnerTopicBySlugQuery, LearnerTopicResponse>
{
    private readonly ITopicsRepository _repository;
    private readonly ICacheService _cache;

    public GetLearnerTopicBySlugQueryHandler(ITopicsRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<LearnerTopicResponse> Handle(GetLearnerTopicBySlugQuery request, CancellationToken cancellationToken)
    {
        var key = CacheKeys.TopicBySlug(request.Slug);
        var cached = await _cache.GetAsync<LearnerTopicResponse>(key);
        if (cached is not null)
        {
            Console.WriteLine("[CACHE] Get Topic By Slug - HIT");
            return cached;
        }

        Console.WriteLine("[CACHE] Get Topic By Slug - MISS");

        var topic = await _repository.GetPublishedBySlugAsync(request.Slug, cancellationToken);
        if (topic is null)
            throw new NotFoundException("Topic not found.");

        var result = new LearnerTopicResponse
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
        };

        await _cache.SetAsync(key, result, TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get Topic By Slug - STORED");
        return result;
    }
}
