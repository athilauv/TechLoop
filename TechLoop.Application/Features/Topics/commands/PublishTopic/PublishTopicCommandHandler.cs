using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Topics.Commands.PublishTopic;

public sealed class PublishTopicCommandHandler : IRequestHandler<PublishTopicCommand, PublishTopicResponse>
{
    private readonly ITopicsRepository _repository;
    private readonly ICurrentUserService _currentUser;
    public PublishTopicCommandHandler(ITopicsRepository repository, ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<PublishTopicResponse> Handle(PublishTopicCommand request, CancellationToken cancellationToken)
    {
        // Check whether the topic exists.
        var topic = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (topic is null)
        {
            throw new NotFoundException("Topic not found.");
        }

        // Check whether the topic is already published.
        if (topic.PublishedAt is not null)
        {
            throw new ValidationException("Topic is already published.");
        }

        // Get the technology assigned to the topic.
        var topicTechnologyId = await _repository.GetTechnologyIdAsync(request.Id, cancellationToken);
        if (topicTechnologyId is null)
        {
            throw new NotFoundException("Technology not found for this topic.");
        }

        // Get the technology assigned to the current mentor.
        var mentorTechnologyId = await _repository.GetMentorTechnologyIdAsync(_currentUser.UserId, cancellationToken);
        if (mentorTechnologyId is null)
        {
            throw new ValidationException("No technology is assigned to your account.");
        }

        // Ensure the mentor can publish only topics from their technology.
        if (topicTechnologyId != mentorTechnologyId)
        {
            throw new ValidationException("You can publish only topics belonging to your technology.");
        }

        // Publish the topic.
        topic.PublishedAt = DateTime.UtcNow;
        topic.PublishedBy = _currentUser.UserId;

        // var rowsAffected = await _repository.PublishAsync(topic, cancellationToken);
        // if (rowsAffected <= 0)
        // {
        //     throw new Exception("Failed to publish topic.");
        // }

        return new PublishTopicResponse
        {
            Success = true,
            Message = "Topic published successfully."
        };
    }
}