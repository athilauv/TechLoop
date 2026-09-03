using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Features.Curriculum.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Curriculum.Queries;

public sealed class GetLearnerCurriculumQueryHandler : IRequestHandler<GetLearnerCurriculumQuery, LearnerCurriculumResponse?>
{
    private readonly ICurriculumRepository _curriculumRepository;
    private readonly ICacheService _cache;

    public GetLearnerCurriculumQueryHandler(ICurriculumRepository curriculumRepository, ICacheService cache)
    {
        _curriculumRepository = curriculumRepository;
        _cache = cache;
    }

    public async Task<LearnerCurriculumResponse?> Handle(GetLearnerCurriculumQuery request, CancellationToken cancellationToken)
    {
        var key = CacheKeys.Curriculum(request.TechnologyId);
        var cached = await _cache.GetAsync<LearnerCurriculumResponse>(key);
        if (cached is not null)
        {
            Console.WriteLine("[CACHE] Get Learner Curriculum - HIT");
            return cached;
        }

        Console.WriteLine("[CACHE] Get Learner Curriculum - MISS");

        var result = await _curriculumRepository.GetLearnerCurriculumAsync(request.TechnologyId, cancellationToken);
        if (result is not null)
            await _cache.SetAsync(key, result, TimeSpan.FromMinutes(5));
        Console.WriteLine("[CACHE] Get Learner Curriculum - STORED");

        return result;
    }
}
