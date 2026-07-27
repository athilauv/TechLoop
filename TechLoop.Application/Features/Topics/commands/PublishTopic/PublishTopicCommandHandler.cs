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
        var topic = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (topic is null)
        {
            throw new NotFoundException("Topic not found.");
        }

        if (topic.PublishedAt is not null)
        {
            throw new ValidationException("Topic is already published.");
        }

        topic.PublishedAt = DateTime.UtcNow;
        topic.PublishedBy = _currentUser.UserId;

       //var rowsAffected = await _repository.PublishAsync(topic, cancellationToken);
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