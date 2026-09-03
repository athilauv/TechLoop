using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TechnologyCategories.Queries.GetTechnologyCategoryById.LearnerMentor;

public sealed class GetPublishedTechnologyCategoryByIdQueryHandler : IRequestHandler<GetPublishedTechnologyCategoryByIdQuery, LearnerMentorTechnologyCategoryResponse?>
{
    private readonly ITechnologyCategoryRepository _repository;
    private readonly ICacheService _cache;

    public GetPublishedTechnologyCategoryByIdQueryHandler(ITechnologyCategoryRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<LearnerMentorTechnologyCategoryResponse?> Handle(GetPublishedTechnologyCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var key = CacheKeys.TechnologyCategoryById(request.Id);
        var cached = await _cache.GetAsync<LearnerMentorTechnologyCategoryResponse>(key);
        if (cached is not null)
        {
            Console.WriteLine("[CACHE] Get Technology Category By Id - HIT");
            return cached;
        }

        Console.WriteLine("[CACHE] Get Technology Category By Id - MISS");

        var result = await _repository.GetByIdForPublicAsync(request.Id);
        if (result is not null)
            await _cache.SetAsync(key, result, TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get Technology Category By Id - STORED");

        return result;
    }
}
