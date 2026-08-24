using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.SubTopics.Queries.GetAllSubTopics.Mentor;

public sealed class GetAllMentorSubTopicsQueryHandler
    : IRequestHandler<GetAllMentorSubTopicsQuery, IEnumerable<MentorSubTopicResponse>>
{
    private readonly ISubTopicsRepository _repository;

    public GetAllMentorSubTopicsQueryHandler(ISubTopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MentorSubTopicResponse>> Handle(
        GetAllMentorSubTopicsQuery request, CancellationToken cancellationToken)
    {
        var subTopics = await _repository.GetAllMentorAsync(cancellationToken);

        if (request.TopicId.HasValue)
        {
            subTopics = subTopics.Where(x => x.TopicId == request.TopicId.Value);
        }

        return subTopics;
    }
}