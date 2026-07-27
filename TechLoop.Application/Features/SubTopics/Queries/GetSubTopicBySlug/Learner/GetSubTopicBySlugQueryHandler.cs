using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.SubTopics.Queries.GetSubTopicById.Learner;

public sealed class GetLearnerSubTopicByIdQueryHandler
    : IRequestHandler<GetSubTopicBySlugQuery, LearnerSubTopicResponse>
{
    private readonly ISubTopicsRepository _repository;

    public GetLearnerSubTopicByIdQueryHandler(
        ISubTopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<LearnerSubTopicResponse> Handle(
        GetSubTopicBySlugQuery request,
        CancellationToken cancellationToken)
    {
        var subTopic = await _repository.GetPublishedByIdAsync(
            request.Id,
            cancellationToken);

        if (subTopic is null)
        {
            throw new NotFoundException("Sub topic not found.");
        }

        return new LearnerSubTopicResponse
        {
            Id = subTopic.Id,
            TopicId = subTopic.TopicId,
            Title = subTopic.Title,
            Slug = subTopic.Slug,
            Description = subTopic.Description,
            ImageUrl = subTopic.ImageUrl,
            Position = subTopic.Position,
            CreatedAt = subTopic.CreatedAt,
            UpdatedAt = subTopic.UpdatedAt,
        };
    }
}