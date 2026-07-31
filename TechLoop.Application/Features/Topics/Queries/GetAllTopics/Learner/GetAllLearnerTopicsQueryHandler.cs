using MediatR;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Topics.Queries.GetAllTopics.Learner;

public sealed class GetAllLearnerTopicsQueryHandler : IRequestHandler<GetAllLearnerTopicsQuery, IEnumerable<LearnerTopicResponse>>
{
    private readonly ITopicsRepository _repository;

    public GetAllLearnerTopicsQueryHandler(ITopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<LearnerTopicResponse>> Handle(GetAllLearnerTopicsQuery request, CancellationToken cancellationToken)
    {
        var topics = await _repository.GetPublishedAsync(cancellationToken);
        return topics.Select(topic => new LearnerTopicResponse
        {
            Id = topic.Id,
            TechnologyId = topic.TechnologyId,
            Title = topic.Title,
            Slug = topic.Slug,
            Description = topic.Description,
            ImageUrl = topic.ImageUrl,
            Example =  topic.Example,
            ExampleType = topic.ExampleType,
            Position = topic.Position
        });
    }
}