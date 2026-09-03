using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Technologies.Queries.GetAllTechnologies.Learner;

public sealed class GetAllLearnerTechnologiesQueryHandler
    : IRequestHandler<
        GetAllLearnerTechnologiesQuery,
        IEnumerable<LearnerTechnologyResponse>>
{
    private readonly ITechnologyRepository _repository;
    private readonly ICacheService _cache;

    public GetAllLearnerTechnologiesQueryHandler(
        ITechnologyRepository repository,
        ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<IEnumerable<LearnerTechnologyResponse>> Handle(
        GetAllLearnerTechnologiesQuery request,
        CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<List<LearnerTechnologyResponse>>(
            CacheKeys.Technologies);

        if (cached is not null)
        {
                        return cached;
        }

        
        Console.WriteLine("[CACHE] Get All Technologies - MISS");

        var technologies = await _repository.GetPublishedAsync(
            cancellationToken);

        var result = technologies.Select(technology =>
            new LearnerTechnologyResponse
            {
                Id = technology.Id,
                CategoryId = technology.CategoryId,
                Name = technology.Name,
                Slug = technology.Slug,
                Description = technology.Description,
                ImageUrl = technology.ImageUrl,
                Position = technology.Position,
                CreatedAt = technology.CreatedAt,
                UpdatedAt = technology.UpdatedAt
            }).ToList();

        await _cache.SetAsync(
            CacheKeys.Technologies,
            result,
            TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get All Technologies - STORED");

        
        return result;
    }
}
