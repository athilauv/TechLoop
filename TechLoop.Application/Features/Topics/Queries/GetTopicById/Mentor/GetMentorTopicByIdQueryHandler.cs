using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Topics.Queries.GetTopicById.Mentor;

public sealed class GetMentorTopicByIdQueryHandler : IRequestHandler<GetMentorTopicByIdQuery, MentorTopicResponse>
{
    private readonly ITopicsRepository _repository;
    public GetMentorTopicByIdQueryHandler(
        ITopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<MentorTopicResponse> Handle(GetMentorTopicByIdQuery request, CancellationToken cancellationToken)
    {
        var topic = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (topic is null)
        {
            throw new NotFoundException("Topic not found.");
        }

        return new MentorTopicResponse
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
        };
    }
}