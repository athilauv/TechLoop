using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Topics.Commands.CreateTopic;

public sealed class CreateTopicCommandHandler : IRequestHandler<CreateTopicCommand, CreateTopicResponse>
{
    private readonly ITopicsRepository _repository;
    private readonly ITechnologyRepository _technologyRepository;   
    private readonly ICurrentUserService _currentUser;

    public CreateTopicCommandHandler(ITopicsRepository repository,ITechnologyRepository technologyRepository, ICurrentUserService currentUser)
    {
        _repository = repository;
        _technologyRepository = technologyRepository;
        _currentUser = currentUser;
    }

    public async Task<CreateTopicResponse> Handle(CreateTopicCommand request, CancellationToken cancellationToken)
    {
        var technology = await _technologyRepository.GetByIdAsync(request.TechnologyId, cancellationToken);
        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }
        
        var slugExists = await _repository.SlugExistsAsync(request.Slug, cancellationToken);
        if (slugExists)
        {
            throw new ValidationException($"Topic slug '{request.Slug}' already exists.");
        }

        var positionExists = await _repository.PositionExistsAsync(request.TechnologyId,request.Position, cancellationToken);
        if (positionExists)
        {
            throw new ValidationException($"Topic position '{request.Position}' already exists in the technology.");
        }
        
        var exists = await _repository.ExistsAsync(request.TechnologyId,request.Title,cancellationToken);
        if (exists)
        {
            throw new ValidationException($"Topic '{request.Title}' already exists in the technology.");
        }
        var topic = new Topic
        {
            TechnologyId = request.TechnologyId,
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Description = request.Description ?? string.Empty,
            ImageUrl = request.ImageUrl ?? string.Empty,
            Example = request.Example,
            ExampleType = request.ExampleType,
            Position = request.Position,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = _currentUser.UserId
        };

        var id = await _repository.CreateAsync(topic, request.ShiftPositions, cancellationToken);
        var createdTopic = await _repository.GetByIdAsync(id, cancellationToken);
        if (createdTopic is null)
        {
            throw new Exception("Failed to create topic.");
        }

        return new CreateTopicResponse
        {
            Success = true,
            Message = "Topic created successfully."
        };
    }
}