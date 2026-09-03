using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TechnologyCategories.Queries.GetAllTechnologyCategories.LearnerMentor;

public sealed class GetAllPublishedTechnologyCategoriesQueryHandler : IRequestHandler<GetAllPublishedTechnologyCategoriesQuery, IEnumerable<LearnerMentorTechnologyCategoryResponse>>
{
    private readonly ITechnologyCategoryRepository _repository;
    private readonly ICacheService _cache;

    public GetAllPublishedTechnologyCategoriesQueryHandler(ITechnologyCategoryRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<IEnumerable<LearnerMentorTechnologyCategoryResponse>> Handle(GetAllPublishedTechnologyCategoriesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<List<LearnerMentorTechnologyCategoryResponse>>(CacheKeys.TechnologyCategories);
        if (cached is not null)
        {
            Console.WriteLine("[CACHE] Get All Technology Categories - HIT");
            return cached;
        }

        Console.WriteLine("[CACHE] Get All Technology Categories - MISS");

        var result = (await _repository.GetAllForPublicAsync()).ToList();
        await _cache.SetAsync(CacheKeys.TechnologyCategories, result, TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get All Technology Categories - STORED");
        return result;
    }
}
