using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.SubTopics.Queries.GetAllSubTopics.Learner;

public sealed class GetAllLearnerSubTopicsQueryHandler : IRequestHandler<GetAllLearnerSubTopicsQuery, IEnumerable<LearnerSubTopicResponse>>
{
    private readonly ISubTopicsRepository _repository;

    public GetAllLearnerSubTopicsQueryHandler(ISubTopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<LearnerSubTopicResponse>> Handle(GetAllLearnerSubTopicsQuery request, CancellationToken cancellationToken)
    {
        var subTopics = await _repository.GetPublishedAsync(cancellationToken);

        return subTopics.Select(subTopic => new LearnerSubTopicResponse
        {
            Id = subTopic.Id,
            TopicId = subTopic.TopicId,
            Title = subTopic.Title,
            Slug = subTopic.Slug,
            Description = subTopic.Description,
            ImageUrl = subTopic.ImageUrl,
            Example =  subTopic.Example,    
            ExampleType = subTopic.ExampleType, 
            Position = subTopic.Position
        });
    }
}