using MediatR;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Topics.Queries.GetAllTopics.Mentor;

public sealed class GetAllMentorTopicsQueryHandler : IRequestHandler<GetAllMentorTopicsQuery, IEnumerable<MentorTopicResponse>>
{
    private readonly ITopicsRepository _repository;
    public GetAllMentorTopicsQueryHandler(ITopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MentorTopicResponse>> Handle(GetAllMentorTopicsQuery request, CancellationToken cancellationToken)
    {
        var topics = await _repository.GetAllAsync(cancellationToken);
        return topics.Select(topic => new MentorTopicResponse
        {
            Id = topic.Id,
            TechnologyId = topic.TechnologyId,
            Title = topic.Title,
            Slug = topic.Slug,
            Description = topic.Description,
            ImageUrl = topic.ImageUrl,
            Example =  topic.Example,
            ExampleType = topic.ExampleType,
            Position = topic.Position,
            PublishedAt = topic.PublishedAt,
            PublishedBy = topic.PublishedBy,
            CreatedAt = topic.CreatedAt,
            CreatedBy = topic.CreatedBy,
            UpdatedAt = topic.UpdatedAt,
            UpdatedBy = topic.UpdatedBy
        });
    }
}