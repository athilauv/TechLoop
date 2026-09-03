using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.SubTopics.Commands.PublishSubTopic;

public sealed class PublishSubTopicCommandHandler
    : IRequestHandler<PublishSubTopicCommand, PublishSubTopicResponse>
{
    private readonly ISubTopicsRepository _repository;
    private readonly ICurrentUserService _currentUser;
    private readonly ICacheService _cache;

    public PublishSubTopicCommandHandler(
        ISubTopicsRepository repository,
        ICurrentUserService currentUser, ICacheService cache)
    {
        _repository = repository;
        _currentUser = currentUser;
        _cache = cache;
    }

    public async Task<PublishSubTopicResponse> Handle(PublishSubTopicCommand request, CancellationToken cancellationToken)
    {
        var subTopic = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (subTopic is null)
        {
            throw new NotFoundException("Sub topic not found.");
        }

        if (subTopic.PublishedAt.HasValue)
        {
            throw new ValidationException( "Sub topic is already published.");
        }

        var mentorTechnologyId = await _repository.GetMentorTechnologyIdAsync(_currentUser.UserId, cancellationToken);
        if (!mentorTechnologyId.HasValue)
        {
            throw new ValidationException("No technology is assigned to the mentor.");
        }

        var subTopicTechnologyId = await _repository.GetTechnologyIdAsync(request.Id, cancellationToken);
        if (!subTopicTechnologyId.HasValue)
        {
            throw new ValidationException("Unable to determine the sub topic technology.");
        }

        if (mentorTechnologyId.Value != subTopicTechnologyId.Value)
        {
            throw new ValidationException("You are not allowed to publish this sub topic.");
        }

        subTopic.PublishedAt = DateTime.UtcNow;
        subTopic.PublishedBy = _currentUser.UserId;

        var rowsAffected = await _repository.PublishAsync( subTopic, cancellationToken);
        if (rowsAffected <= 0)
        {
            throw new Exception( "Failed to publish sub topic.");
        }

        await _cache.RemoveAsync(CacheKeys.SubTopics);
        await _cache.RemoveAsync(CacheKeys.SubTopicBySlug(subTopic.Slug));
        await _cache.RemoveAsync(CacheKeys.Curriculum(subTopicTechnologyId.Value));

        return new PublishSubTopicResponse
        {
            Success = true,
            Message = "Sub topic published successfully."
        };
    }
}