using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.SubTopics.Queries.GetAllSubTopics.Mentor;

public sealed class GetAllMentorSubTopicsQueryHandler
    : IRequestHandler<GetAllMentorSubTopicsQuery, IEnumerable<MentorSubTopicResponse>>
{
    private readonly ISubTopicsRepository _repository;
    private readonly ICurrentUserService _currentUser;

    public GetAllMentorSubTopicsQueryHandler(
        ISubTopicsRepository repository,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<IEnumerable<MentorSubTopicResponse>> Handle(
        GetAllMentorSubTopicsQuery request, CancellationToken cancellationToken)
    {
        var subTopics = await _repository.GetAllMentorAsync(_currentUser.UserId, cancellationToken);

        if (request.TopicId.HasValue)
        {
            subTopics = subTopics.Where(x => x.TopicId == request.TopicId.Value);
        }

        return subTopics;
    }
}