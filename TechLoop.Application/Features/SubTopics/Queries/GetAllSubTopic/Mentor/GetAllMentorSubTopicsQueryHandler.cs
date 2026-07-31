using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.SubTopics.Queries.GetAllSubTopics.Mentor;

public sealed class GetAllMentorSubTopicsQueryHandler : IRequestHandler<GetAllMentorSubTopicsQuery, IEnumerable<MentorSubTopicResponse>>
{
    private readonly ISubTopicsRepository _repository;
    public GetAllMentorSubTopicsQueryHandler(ISubTopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MentorSubTopicResponse>> Handle(GetAllMentorSubTopicsQuery request, CancellationToken cancellationToken)
    {
        var subTopics = await _repository.GetAllAsync(cancellationToken);
        return subTopics.Select(subTopic => new MentorSubTopicResponse
        {
            Id = subTopic.Id,
            TopicId = subTopic.TopicId,
            Title = subTopic.Title,
            Slug = subTopic.Slug,
            Description = subTopic.Description,
            ImageUrl = subTopic.ImageUrl,
            Example =  subTopic.Example,
            ExampleType = subTopic.ExampleType,
            Position = subTopic.Position,
            PublishedAt = subTopic.PublishedAt,
            PublishedBy = subTopic.PublishedBy,
            CreatedAt = subTopic.CreatedAt,
            CreatedBy = subTopic.CreatedBy,
            UpdatedAt = subTopic.UpdatedAt,
            UpdatedBy = subTopic.UpdatedBy
        });
    }
}