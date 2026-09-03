// using FluentValidation;
using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.TechnologyCategories.Commands.UpdateTechnologyCategory;

public sealed class UpdateTechnologyCategoryCommandHandler
    : IRequestHandler<UpdateTechnologyCategoryCommand, UpdateTechnologyCategoryResponse>
{
    private readonly ITechnologyCategoryRepository _repository;
    private readonly ICacheService _cache;

    public UpdateTechnologyCategoryCommandHandler(
        ITechnologyCategoryRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<UpdateTechnologyCategoryResponse> Handle(
        UpdateTechnologyCategoryCommand request,
        CancellationToken cancellationToken)
    {
        var categoryExists = await _repository.ExistsAsync(request.Id, cancellationToken);
        if (!categoryExists)
        {
            throw new NotFoundException("Technology category not found.");
        }
        var exists = await _repository.NameExistsAsync(request.Request.Name, request.Id, cancellationToken);;
        if (exists)
        {
            throw new ValidationException($"Technology category '{request.Request.Name}' already exists.");
        }

        var technologyCategory = new TechnologyCategory
        {
            Id = request.Id,
            Name = request.Request.Name.Trim(),
            UpdatedBy = request.UpdatedBy
        };

        await _repository.UpdateAsync(technologyCategory, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.TechnologyCategories);
        await _cache.RemoveAsync(CacheKeys.TechnologyCategoryById(request.Id));

        return new UpdateTechnologyCategoryResponse
        {
            Success = true,
            Message = "Technology category updated successfully."
        };
    }
}