using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.SubTopics.Queries.GetSubTopicById.Mentor;

public sealed class GetMentorSubTopicByIdQueryHandler : IRequestHandler<GetMentorSubTopicByIdQuery, MentorSubTopicResponse>
{
    private readonly ISubTopicsRepository _repository;
    public GetMentorSubTopicByIdQueryHandler(ISubTopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<MentorSubTopicResponse> Handle(GetMentorSubTopicByIdQuery request, CancellationToken cancellationToken)
    {
        var subTopic = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (subTopic is null)
        {
            throw new NotFoundException("Sub topic not found.");
        }

        return new MentorSubTopicResponse
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
        };
    }
}