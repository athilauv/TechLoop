using MediatR;
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

    public PublishSubTopicCommandHandler(
        ISubTopicsRepository repository,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
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

        return new PublishSubTopicResponse
        {
            Success = true,
            Message = "Sub topic published successfully."
        };
    }
}