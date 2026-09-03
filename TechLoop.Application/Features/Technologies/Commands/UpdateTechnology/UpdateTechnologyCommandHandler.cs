using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Domain.Enums;


namespace TechLoop.Application.Features.Technologies.Commands.UpdateTechnology;

public sealed class UpdateTechnologyCommandHandler : IRequestHandler<UpdateTechnologyCommand, UpdateTechnologyResponse>
{
   private readonly ITechnologyRepository _technologyRepository;
   private readonly ICurrentUserService _currentUserService;
   private readonly ITechnologyCategoryRepository _technologycategoryRepository;
   private readonly ICacheService _cache;

   public UpdateTechnologyCommandHandler(ITechnologyRepository technologyRepository, ITechnologyCategoryRepository technologycategoryRepository, ICurrentUserService currentUserService, ICacheService cache)
   {
      _technologyRepository = technologyRepository;
      _technologycategoryRepository = technologycategoryRepository;
      _currentUserService = currentUserService;
      _cache = cache;
   }

   public async Task<UpdateTechnologyResponse> Handle(UpdateTechnologyCommand request, CancellationToken cancellationToken)
   {
      var technology = await _technologyRepository.GetByIdAsync(request.id, cancellationToken);
      if (technology is null)
      {
         throw new NotFoundException(("Technology not found"));
      }
      var exists = await _technologyRepository.NameExistsAsync(request.CategoryId, request.Name, request.id, cancellationToken);
      if (exists)
      {
         throw new ValidationException($"Technology '{request.Name}' already exists in the category.");
      }

      var slug = string.IsNullOrWhiteSpace(request.Slug)
         ? request.Name.Trim().ToLowerInvariant().Replace(" ", "-")
         : request.Slug.Trim().ToLowerInvariant();

      var slugExists = await _technologyRepository.SlugExistsAsync(slug, request.id, cancellationToken);
      if (slugExists)
      {
         throw new ValidationException($"Technology slug '{slug}' already exists.");
      }

      var positionExists = await _technologyRepository.PositionExistsAsync(request.CategoryId, request.Position, request.id, cancellationToken);
      if (positionExists)
      {
         throw new ValidationException($"Technology position '{request.Position}' already exists in the category.");
      }
      
      var categoryExists = await _technologycategoryRepository.ExistsAsync(request.CategoryId, cancellationToken);

      if (!categoryExists)
      {
         throw new NotFoundException("Category not found.");
      }

      technology.CategoryId = request.CategoryId;
      technology.Name =request.Name.Trim();
      technology.Description = request.Description ?? string.Empty;
      technology.Slug = slug;
      technology.ImageUrl = request.ImageUrl ?? string.Empty;
      technology.Position = request.Position;
      technology.UpdatedAt = DateTime.UtcNow;
      technology.UpdatedBy = _currentUserService.UserId;

      var oldSlug = technology.Slug;
      await _technologyRepository.UpdateAsync(technology, cancellationToken);
      await _cache.RemoveAsync(CacheKeys.Technologies);
      await _cache.RemoveAsync(CacheKeys.TechnologyBySlug(oldSlug));
      await _cache.RemoveAsync(CacheKeys.TechnologyBySlug(technology.Slug));
      await _cache.RemoveAsync(CacheKeys.Curriculum(technology.Id));

      return new UpdateTechnologyResponse
      {
         Success = true,
         Message = "Technology updated successfully."
      };
   }
}

