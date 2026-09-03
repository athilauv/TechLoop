using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Topics.Commands.UpdateTopic;

public sealed class UpdateTopicCommandHandler : IRequestHandler<UpdatedTopicCommand, UpdateTopicResponse>
{
    private readonly ITopicsRepository _repository;
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUser;
    private readonly ICacheService _cache;

    public UpdateTopicCommandHandler(ITopicsRepository repository,ITechnologyRepository technologyRepository,ICurrentUserService currentUser, ICacheService cache)
    {
        _repository = repository;
        _technologyRepository = technologyRepository;
        _currentUser = currentUser;
        _cache = cache;
    }

    public async Task<UpdateTopicResponse> Handle(UpdatedTopicCommand request, CancellationToken cancellationToken)
    {
        var topic = await _repository.GetByIdAsync(request.id, cancellationToken);
        if (topic is null)
        {
            throw new KeyNotFoundException("Topic not found.");
        }
        
        var technology = await _technologyRepository.GetByIdAsync(request.TechnologyId, cancellationToken);
        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        var slugExists = await _repository.SlugExistsAsync(request.Slug, cancellationToken);
        if (slugExists && !topic.Slug.Equals(request.Slug, StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException($"Sub topic slug '{request.Slug}' already exists.");
        }
        var positionExists = await _repository.PositionExistsAsync(request.TechnologyId, request.Position, cancellationToken);
        if (positionExists && topic.Position != request.Position)
        {
            throw new ValidationException($"Sub topic position '{request.Position}' already exists.");
        }
        
        var exists = await _repository.ExistsAsync(request.TechnologyId, request.Title, cancellationToken);
        if (exists && !topic.Title.Equals(request.Title, StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException($"Topic '{request.Title}' already exists in the technology.");
        }
        var oldSlug = topic.Slug;
        var oldTechnologyId = topic.TechnologyId;
        topic.TechnologyId = request.TechnologyId;
        topic.Title = request.Title.Trim();
        topic.Description = request.Description;
        topic.ImageUrl = request.ImageUrl;
        topic.Slug = request.Slug.Trim().ToLowerInvariant();
        topic.Example = request.Example ?? string.Empty;
        topic.ExampleType = request.ExampleType;
        topic.Position = request.Position;
        topic.UpdatedBy = _currentUser.UserId;
        topic.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(topic, request.ShiftPositions, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.Topics);
        await _cache.RemoveAsync(CacheKeys.TopicBySlug(oldSlug));
        await _cache.RemoveAsync(CacheKeys.TopicBySlug(topic.Slug));
        await _cache.RemoveAsync(CacheKeys.Curriculum(oldTechnologyId));
        await _cache.RemoveAsync(CacheKeys.Curriculum(topic.TechnologyId));

        return new UpdateTopicResponse
        {
            Success = true,
            Message = "Topic updated successfully."
        };
    }
}