using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Topics.Queries.GetTopicById.Learner;

public sealed class GetLearnerTopicByIdQueryHandler : IRequestHandler<GetLearnerTopicBySlugQueryHandler, LearnerTopicResponse>
{
    private readonly ITopicsRepository _repository;
    public GetLearnerTopicByIdQueryHandler(ITopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<LearnerTopicResponse> Handle(GetLearnerTopicBySlugQueryHandler request, CancellationToken cancellationToken)
    {
        var topic = await _repository.GetPublishedByIdAsync(request.Id, cancellationToken);
        if (topic is null)
        {
            throw new NotFoundException("Topic not found.");
        }

        return new LearnerTopicResponse
        {
            Id = topic.Id,
            TechnologyId = topic.TechnologyId,
            Title = topic.Title,
            Slug = topic.Slug,
            Description = topic.Description,
            ImageUrl = topic.ImageUrl,
            Position = topic.Position,
            CreatedAt = topic.CreatedAt,
            UpdatedAt = topic.UpdatedAt,
        };
    }
}