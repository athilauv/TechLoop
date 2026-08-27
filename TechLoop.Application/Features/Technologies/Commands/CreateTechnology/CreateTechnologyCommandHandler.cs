using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;
using MediatR;

namespace TechLoop.Application.Features.Technologies.Commands.CreateTechnology;

public sealed class CreateTechnologyCommandHandler : IRequestHandler<CreateTechnologyCommand, CreateTechnologyResponse>
{
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ITechnologyCategoryRepository _technologycategoryRepository;

    public CreateTechnologyCommandHandler(ITechnologyRepository technologyRepository, ITechnologyCategoryRepository technologycategoryRepository, ICurrentUserService currentUserService)
    {
        _technologyRepository = technologyRepository;
        _technologycategoryRepository = technologycategoryRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CreateTechnologyResponse> Handle(CreateTechnologyCommand request, CancellationToken cancellationToken)
    {
        var exists = await _technologyRepository.ExistsAsync(request.CategoryId, request.Name, cancellationToken);
        if (exists)
        {
            throw new ValidationException($"Technology '{request.Name}' already exists in the category.");
        }
        
        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Name)
            : request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _technologyRepository.SlugExistsAsync(slug, cancellationToken);
        if (slugExists)
        {
            throw new ValidationException($"Technology slug '{request.Slug}' already exists.");
        }
        var positionExists = await _technologyRepository.PositionExistsAsync(request.CategoryId,request.Position, cancellationToken);
        if (positionExists)
        {
            throw new ValidationException($"Technology position '{request.Position}' already exists in the category.");
        }
        var categoryExists = await _technologycategoryRepository.ExistsAsync(request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            throw new NotFoundException("Category not found.");
        }
        
        var technology = new Technology
        {
            CategoryId = request.CategoryId,
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description ?? string.Empty,
            ImageUrl = request.ImageUrl ?? string.Empty,
            Position = request.Position,
            CreatedBy = _currentUserService.UserId,
            CreatedAt = DateTime.UtcNow
        };
        await _technologyRepository.CreateAsync(technology, cancellationToken);

        return new CreateTechnologyResponse
        {
            Success = true,
            Message = "Technology added successfully."
        };
    }

    private static string GenerateSlug(string value)
    {
        return value
            .Trim()
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("--", "-");
    }
}