using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.SubTopics.Queries.GetSubTopicById.Learner;

public sealed class GetSubTopicBySlugQueryHandler : IRequestHandler<GetSubTopicBySlugQuery, LearnerSubTopicResponse>
{
    private readonly ISubTopicsRepository _repository;
    private readonly ICacheService _cache;

    public GetSubTopicBySlugQueryHandler(ISubTopicsRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<LearnerSubTopicResponse> Handle(GetSubTopicBySlugQuery request, CancellationToken cancellationToken)
    {
        var key = CacheKeys.SubTopicBySlug(request.Slug);
        var cached = await _cache.GetAsync<LearnerSubTopicResponse>(key);
        if (cached is not null)
        {
            Console.WriteLine("[CACHE] Get SubTopic By Slug - HIT");
            return cached;
        }

        Console.WriteLine("[CACHE] Get SubTopic By Slug - MISS");

        var subTopic = await _repository.GetPublishedBySlugAsync(request.Slug, cancellationToken);
        if (subTopic is null)
            throw new NotFoundException("Sub topic not found.");

        var result = new LearnerSubTopicResponse
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
        };

        await _cache.SetAsync(key, result, TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get SubTopic By Slug - STORED");
        return result;
    }
}
