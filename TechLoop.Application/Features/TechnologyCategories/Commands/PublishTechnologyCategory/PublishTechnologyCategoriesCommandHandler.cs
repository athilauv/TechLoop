// using FluentValidation;
using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TechnologyCategories.Commands.PublishTechnologyCategory;

public sealed class PublishTechnologyCategoryCommandHandler : IRequestHandler<PublishTechnologyCategoryCommand, PublishTechnologyCategoryResponse>
{
    private readonly ITechnologyCategoryRepository _repository;
    private readonly ICacheService _cache;
    public PublishTechnologyCategoryCommandHandler(ITechnologyCategoryRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<PublishTechnologyCategoryResponse> Handle(PublishTechnologyCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _repository.GetByIdForAdminAsync(request.Id, cancellationToken);
        if (category is null)
        {
            throw new NotFoundException("Technology category not found.");
        }

        if (category.PublishAt is not null)
        {
            throw new ValidationException("Technology category is already published.");
        }
        
        await _repository.PublishAsync(request.Id, request.PublishedBy, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.TechnologyCategories);
        await _cache.RemoveAsync(CacheKeys.TechnologyCategoryById(request.Id));

        return new PublishTechnologyCategoryResponse
        {
            Success = true,
            Id = request.Id,
            Message = "Technology category published successfully."
        };
    }
}