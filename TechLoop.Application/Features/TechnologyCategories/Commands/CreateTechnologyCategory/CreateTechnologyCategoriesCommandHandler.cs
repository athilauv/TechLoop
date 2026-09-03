using FluentValidation;
using TechLoop.Application.Common.Caching;
using MediatR;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.TechnologyCategories.Commands.CreateTechnologyCategory;

public sealed class CreateTechnologyCategoriesCommandHandler : IRequestHandler<CreateTechnologyCategoriesCommand, CreateTechnologyCategoryResponse>
{
    private readonly ITechnologyCategoryRepository _repository;
    private readonly ICacheService _cache;
    public CreateTechnologyCategoriesCommandHandler(ITechnologyCategoryRepository repository, ICacheService cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<CreateTechnologyCategoryResponse> Handle(CreateTechnologyCategoriesCommand request, CancellationToken cancellationToken)
    {
        var exists = await _repository.NameExistsAsync(request.Request.Name, null, cancellationToken);
        if (exists)
        {
            throw new ValidationException($"Technology category '{request.Request.Name}' already exists.");
        }

        var technologyCategory = new TechnologyCategory
        {
            Name = request.Request.Name.Trim(),
            CreatedBy = request.CreatedBy
        };

        await _repository.CreateAsync(technologyCategory, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.TechnologyCategories);
        return new CreateTechnologyCategoryResponse
        {
            Success = true,
            Message = "Technology category created successfully."
        };
    }
}