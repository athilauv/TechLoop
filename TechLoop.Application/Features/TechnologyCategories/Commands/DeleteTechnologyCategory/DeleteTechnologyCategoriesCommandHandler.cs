using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TechnologyCategories.Commands.DeleteTechnologyCategory;

public sealed class DeleteTechnologyCategoryCommandHandler : IRequestHandler<DeleteTechnologyCategoryCommand, DeleteTechnologyCategoryResponse>
{
    private readonly ITechnologyCategoryRepository _technologycategoryrepository;
    private readonly ICacheService _cache;

    public DeleteTechnologyCategoryCommandHandler(
        ITechnologyCategoryRepository repository, ICacheService cache)
    {
        _technologycategoryrepository = repository;
        _cache = cache;
    }

    public async Task<DeleteTechnologyCategoryResponse> Handle(DeleteTechnologyCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _technologycategoryrepository.GetByIdForAdminAsync(request.Id, cancellationToken);
        if (category is null)
        {
            throw new NotFoundException("Technology category not found.");
        }
        
        await _technologycategoryrepository.DeleteAsync(request.Id, request.DeletedBy, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.TechnologyCategories);
        await _cache.RemoveAsync(CacheKeys.TechnologyCategoryById(request.Id));

        return new DeleteTechnologyCategoryResponse
        {
            Success = true,
            Id = request.Id,
            Message = "Technology category deleted successfully."
        };
    }
}