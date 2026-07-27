using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Topics.Queries.GetTopicBySlug.Learner;

public sealed class GetLearnerTopicBySlugQueryHandler : IRequestHandler<GetLearnerTopicBySlugQuery, LearnerTopicResponse>
{
    private readonly ITopicsRepository _repository;
    public GetLearnerTopicBySlugQueryHandler(ITopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<LearnerTopicResponse> Handle(GetLearnerTopicBySlugQuery request, CancellationToken cancellationToken)
    {
        var topic = await _repository.GetPublishedBySlugAsync(request.Slug, cancellationToken);
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