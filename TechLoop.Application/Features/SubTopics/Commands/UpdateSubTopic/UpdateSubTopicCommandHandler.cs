using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.SubTopics.Commands.UpdateSubTopic;

public sealed class UpdateSubTopicCommandHandler : IRequestHandler<UpdateSubTopicCommand, UpdateSubTopicResponse>
{
    private readonly ISubTopicsRepository _subtopicrepository;
    private readonly ICurrentUserService _currentUserService;
    public UpdateSubTopicCommandHandler(ISubTopicsRepository repository, ICurrentUserService currentUserService)
    {
        _subtopicrepository = repository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdateSubTopicResponse> Handle(UpdateSubTopicCommand request, CancellationToken cancellationToken)
    {
        var subTopic = await _subtopicrepository.GetByIdAsync(request.Id, cancellationToken);
        if (subTopic is null)
        {
            throw new NotFoundException("Sub topic not found.");
        }

        var topicExists = await _subtopicrepository.TopicExistsAsync(request.TopicId, cancellationToken);
        if (!topicExists)
        {
            throw new NotFoundException("Topic not found.");
        }

        // Validate parent sub topic
        if (request.ParentSubTopicId.HasValue)
        {
            if (request.ParentSubTopicId.Value == request.Id)
            {
                throw new ValidationException("A sub topic cannot be its own parent.");
            }

            var parentExists = await _subtopicrepository.SubTopicIdExistsAsync(request.ParentSubTopicId.Value, cancellationToken);
            if (!parentExists)
            {
                throw new NotFoundException("Parent sub topic not found.");
            }
        }

        var slugExists = await _subtopicrepository.SlugExistsAsync(request.Slug, cancellationToken);
        if (slugExists && !subTopic.Slug.Equals(request.Slug, StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException($"Sub topic slug '{request.Slug}' already exists.");
        }

        var positionExists = await _subtopicrepository.PositionExistsAsync(request.TopicId, request.Position, cancellationToken);
        if (positionExists && subTopic.Position != request.Position)
        {
            throw new ValidationException($"Sub topic position '{request.Position}' already exists in the topic.");
        }

        var exists = await _subtopicrepository.ExistsAsync(request.TopicId, request.Title, cancellationToken);
        if (exists && !subTopic.Title.Equals(request.Title, StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException($"Sub topic '{request.Title}' already exists in the topic.");
        }

        subTopic.TopicId = request.TopicId;
        subTopic.ParentSubTopicId = request.ParentSubTopicId;
        subTopic.Title = request.Title.Trim();
        subTopic.Description = request.Description ?? string.Empty;
        subTopic.ImageUrl = request.ImageUrl ?? string.Empty;
        subTopic.Slug = request.Slug.Trim().ToLowerInvariant();
        subTopic.Position = request.Position;
        subTopic.UpdatedBy = _currentUserService.UserId;
        subTopic.UpdatedAt = DateTime.UtcNow;

        var rowsAffected = await _subtopicrepository.UpdateAsync(subTopic, cancellationToken);
        if (rowsAffected <= 0)
        {
            throw new Exception("Failed to update sub topic.");
        }

        return new UpdateSubTopicResponse
        {
            Success = true,
            Message = "Sub topic updated successfully."
        };
    }
}