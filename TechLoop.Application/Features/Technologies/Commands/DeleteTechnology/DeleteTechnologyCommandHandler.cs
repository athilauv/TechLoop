using TechLoop.Domain;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Application.Features.Technologies.DTOs;
using MediatR;
using TechLoop.Application.Common.Exceptions;

namespace TechLoop.Application.Features.Technologies.Commands.DeleteTechnology;

public sealed class DeleteTechnologyCommandHandler : IRequestHandler<DeleteTechnologyCommand, DeleteTechnologyResponse>
{
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ICacheService _cache;

    public DeleteTechnologyCommandHandler(ITechnologyRepository technologyRepository, ICurrentUserService currentUserService, ICacheService cache)
    {
        _technologyRepository = technologyRepository;
        _currentUserService = currentUserService;
        _cache = cache;
    }

    public async Task<DeleteTechnologyResponse> Handle(DeleteTechnologyCommand request, CancellationToken cancellationToken)
    {
        var technology = await _technologyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        await _technologyRepository.SoftDeleteAsync(request.Id, _currentUserService.UserId, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.Technologies);
        await _cache.RemoveAsync(CacheKeys.TechnologyBySlug(technology.Slug));
        await _cache.RemoveAsync(CacheKeys.Curriculum(technology.Id));

        return new DeleteTechnologyResponse
        {
            Success = true,
            Message = "Technology deleted successfully."
        };
    }
}

