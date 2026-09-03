using FluentValidation;
using TechLoop.Application.Common.Caching;
using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.SubTopics.Commands.CreateSubTopic;

public sealed class CreateSubTopicCommandHandler
    : IRequestHandler<CreateSubTopicCommand, CreateSubTopicResponse>
{
    private readonly ISubTopicsRepository _subTopicsRepository;
    private readonly ITopicsRepository _topicsRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ICacheService _cache;

    public CreateSubTopicCommandHandler(
        ISubTopicsRepository subTopicsRepository,
        ITopicsRepository topicsRepository,
        ICurrentUserService currentUserService, ICacheService cache)
    {
        _subTopicsRepository = subTopicsRepository;
        _topicsRepository = topicsRepository;
        _currentUserService = currentUserService;
        _cache = cache;
    }

    public async Task<CreateSubTopicResponse> Handle(CreateSubTopicCommand request, CancellationToken cancellationToken)
    {

        var topic = await _topicsRepository.GetByIdAsync(request.TopicId, cancellationToken);
        if (topic is null)
        {
            throw new InvalidOperationException("Topic not found.");
        }

        if (request.ParentSubTopicId.HasValue)
        {
            var parentExists = await _subTopicsRepository.SubTopicIdExistsAsync(request.ParentSubTopicId.Value, cancellationToken);
            if (!parentExists)
            {
                throw new InvalidOperationException("Parent sub topic not found.");
            }
        }

        var title = request.Title.Trim();
        var slug = GenerateSlug(request.Slug);
        var description = request.Description?.Trim() ?? string.Empty;
        var imageUrl = request.ImageUrl?.Trim() ?? string.Empty;
        var example = request.Example?.Trim() ?? string.Empty;

        var slugExists = await _subTopicsRepository.SlugExistsAsync(slug, cancellationToken);
        if (slugExists)
        {
            throw new ValidationException($"Sub topic slug '{slug}' already exists.");
        }

        var positionExists = await _subTopicsRepository.PositionExistsAsync(request.TopicId, request.Position, cancellationToken);
        if (positionExists && !request.ShiftPositions)
        {
            throw new ValidationException(
                $"Sub topic position '{request.Position}' is already occupied. " +
                $"Do you want to shift the existing subtopics?");
        }

        var titleExists = await _subTopicsRepository.ExistsAsync(request.TopicId, title, cancellationToken);
        if (titleExists)
        {
            throw new ValidationException($"Sub topic '{title}' already exists in the topic.");
        }

        var subTopic = new SubTopic
        {
            TopicId = request.TopicId,
            ParentSubTopicId = request.ParentSubTopicId,
            Title = title,
            Slug = slug,
            Description = description,
            ImageUrl = imageUrl,
            Example = example,
            ExampleType = request.ExampleType,
            Position = request.Position,
            CreatedBy = _currentUserService.UserId,
            CreatedAt = DateTime.UtcNow
        };

        await _subTopicsRepository.CreateAsync(subTopic,request.ShiftPositions, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.SubTopics);
        await _cache.RemoveAsync(CacheKeys.SubTopicBySlug(subTopic.Slug));
        await _cache.RemoveAsync(CacheKeys.Curriculum(topic.TechnologyId));
        return new CreateSubTopicResponse
        {
            Success = true,
            Message = "Sub topic created successfully."
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