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
        var subTopic = await _repository.GetMentorByIdAsync(request.Id, cancellationToken);
        if (subTopic is null)
        {
            throw new NotFoundException("Sub topic not found.");
        }

        return subTopic;
    }
}