using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Technologies.Queries.GetTechnologyBySlug.Learner;

public sealed class GetLearnerTechnologyBySlugQueryHandler : IRequestHandler<GetLearnerTechnologyBySlugQuery, LearnerTechnologyResponse>
{
    private readonly ITechnologyRepository _repository;
    private readonly ICacheService _cache;

    public GetLearnerTechnologyBySlugQueryHandler(ITechnologyRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<LearnerTechnologyResponse> Handle(GetLearnerTechnologyBySlugQuery request, CancellationToken cancellationToken)
    {
        var key = CacheKeys.TechnologyBySlug(request.Slug);
        var cached = await _cache.GetAsync<LearnerTechnologyResponse>(key);
        if (cached is not null)
        {
            Console.WriteLine("[CACHE] Get Technology By Slug - HIT");
            return cached;
        }

        Console.WriteLine("[CACHE] Get Technology By Slug - MISS");

        var technology = await _repository.GetPublishedBySlugAsync(request.Slug, cancellationToken);
        if (technology is null)
            throw new NotFoundException("Technology not found.");

        var result = new LearnerTechnologyResponse
        {
            Id = technology.Id,
            Name = technology.Name,
            Slug = technology.Slug,
            Description = technology.Description,
            ImageUrl = technology.ImageUrl,
            Position = technology.Position,
            CreatedAt = technology.CreatedAt,
            UpdatedAt = technology.UpdatedAt
        };

        await _cache.SetAsync(key, result, TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get Technology By Slug - STORED");
        return result;
    }
}
