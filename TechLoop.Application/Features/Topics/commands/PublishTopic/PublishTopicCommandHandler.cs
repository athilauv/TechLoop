using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Topics.Commands.PublishTopic;

public sealed class PublishTopicCommandHandler : IRequestHandler<PublishTopicCommand, PublishTopicResponse>
{
    private readonly ITopicsRepository _repository;
    private readonly ICurrentUserService _currentUser;
    private readonly ICacheService _cache;

    public PublishTopicCommandHandler(ITopicsRepository repository, ICurrentUserService currentUser, ICacheService cache)
    {
        _repository = repository;
        _currentUser = currentUser;
        _cache = cache;
    }

    public async Task<PublishTopicResponse> Handle(
        PublishTopicCommand request,
        CancellationToken cancellationToken)
    {
        //Check whether the topic exists.
        var topic = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (topic is null)
        {
            throw new NotFoundException("Topic not found.");
        }

        //Check whether the topic is already published.
        if (topic.PublishedAt.HasValue)
        {
            throw new ValidationException("Topic is already published.");
        }

        //Get the technology assigned to the topic.
        var topicTechnologyId = await _repository.GetTechnologyIdAsync(request.Id, cancellationToken);
        if (!topicTechnologyId.HasValue)
        {
            throw new NotFoundException("Technology not found for this topic.");
        }

        //Get the technology assigned to the current mentor.
        var mentorTechnologyId = await _repository.GetMentorTechnologyIdAsync(_currentUser.UserId, cancellationToken);
        if (!mentorTechnologyId.HasValue)
        {
            throw new ValidationException("No technology is assigned to your account.");
        }

        //Make sure the mentor owns the topic's technology.
        if (topicTechnologyId.Value != mentorTechnologyId.Value)
        {
            throw new ValidationException("You can publish only topics belonging to your technology.");
        }

        //Set publish information.
        topic.PublishedAt = DateTime.UtcNow;
        topic.PublishedBy = _currentUser.UserId;

        //Actually update PostgreSQL.
        var rowsAffected = await _repository.PublishAsync(topic, cancellationToken);
        if (rowsAffected <= 0)
        {
            throw new Exception("Failed to publish topic.");
        }

        await _cache.RemoveAsync(CacheKeys.Topics);
        await _cache.RemoveAsync(CacheKeys.TopicBySlug(topic.Slug));
        await _cache.RemoveAsync(CacheKeys.Curriculum(topic.TechnologyId));

        return new PublishTopicResponse
        {
            Success = true,
            Message = "Topic published successfully."
        };
    }
}