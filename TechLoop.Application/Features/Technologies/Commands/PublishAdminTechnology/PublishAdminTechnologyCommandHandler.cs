using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Technologies.Commands.PublishAdminTechnology;

public sealed class PublishAdminTechnologyCommandHandler : IRequestHandler<PublishAdminTechnologyCommand, PublishTechnologyResponse>
{
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICacheService _cache;

    public PublishAdminTechnologyCommandHandler(ITechnologyRepository technologyRepository, ICacheService cache)
    {
        _technologyRepository = technologyRepository;
        _cache = cache;
    }

    public async Task<PublishTechnologyResponse> Handle(PublishAdminTechnologyCommand request, CancellationToken cancellationToken)
    {
        var technology = await _technologyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        if (technology.PublishedAt is not null)
        {
            throw new ValidationException("Technology is already published.");
        }

        technology.PublishedAt = DateTime.UtcNow;
        technology.PublishedBy = request.PublishedBy;

        await _technologyRepository.PublishAsync(technology, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.Technologies);
        await _cache.RemoveAsync(CacheKeys.TechnologyBySlug(technology.Slug));
        await _cache.RemoveAsync(CacheKeys.Curriculum(technology.Id));

        return new PublishTechnologyResponse
        {
            Success = true,
            Message = "Technology published successfully."
        };
    }
}
