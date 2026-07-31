using TechLoop.Application.Features.Technologies.DTOs;
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

   public UpdateTechnologyCommandHandler(ITechnologyRepository technologyRepository, ITechnologyCategoryRepository technologycategoryRepository, ICurrentUserService currentUserService)
   {
      _technologyRepository = technologyRepository;
      _technologycategoryRepository = technologycategoryRepository;
      _currentUserService = currentUserService;
   }

   public async Task<UpdateTechnologyResponse> Handle(UpdateTechnologyCommand request, CancellationToken cancellationToken)
   {
      var technology = await _technologyRepository.GetByIdAsync(request.id, cancellationToken);
      if (technology is null)
      {
         throw new NotFoundException(("Technology not found"));
      }
      var exists = await _technologyRepository.ExistsAsync(request.CategoryId, request.Name, cancellationToken);

      if (exists && !technology.Name.Equals(request.Name, StringComparison.OrdinalIgnoreCase))
      {
         throw new ValidationException($"Technology '{request.Name}' already exists in the category.");
      }
      var slugExists = await _technologyRepository.SlugExistsAsync(request.Slug, cancellationToken);
      if (slugExists && !technology.Slug.Equals(request.Slug, StringComparison.OrdinalIgnoreCase))
      {
         throw new ValidationException($"Technology slug '{request.Slug}' already exists.");
      }
      var positionExists = await _technologyRepository.PositionExistsAsync(request.CategoryId,request.Position, cancellationToken);
      if (positionExists && technology.Position != request.Position)
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
      technology.Slug = request.Slug.Trim().ToLowerInvariant();
      technology.ImageUrl = request.ImageUrl ?? string.Empty;
      technology.Position = request.Position;
      technology.UpdatedAt = DateTime.UtcNow;
      technology.UpdatedBy = _currentUserService.UserId;

      return new UpdateTechnologyResponse
      {
         Success = true,
         Message = "Technology updated successfully."
      };
   }
}

