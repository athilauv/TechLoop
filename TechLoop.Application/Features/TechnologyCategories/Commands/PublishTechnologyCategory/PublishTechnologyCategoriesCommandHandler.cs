// using FluentValidation;
using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TechnologyCategories.Commands.PublishTechnologyCategory;

public sealed class PublishTechnologyCategoryCommandHandler : IRequestHandler<PublishTechnologyCategoryCommand, PublishTechnologyCategoryResponse>
{
    private readonly ITechnologyCategoryRepository _repository;
    public PublishTechnologyCategoryCommandHandler(ITechnologyCategoryRepository repository)
    {
        _repository = repository;
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

        return new PublishTechnologyCategoryResponse
        {
            Success = true,
            Id = request.Id,
            Message = "Technology category published successfully."
        };
    }
}