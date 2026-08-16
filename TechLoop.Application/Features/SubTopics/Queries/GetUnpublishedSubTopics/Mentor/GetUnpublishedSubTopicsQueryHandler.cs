using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.SubTopics.Queries.Mentor.GetUnpublishedSubTopics;

public sealed class GetUnpublishedSubTopicsQueryHandler : IRequestHandler<GetUnpublishedSubTopicsQuery, IEnumerable<MentorSubTopicResponse>>
{
    private readonly ISubTopicsRepository _repository;

    public GetUnpublishedSubTopicsQueryHandler(ISubTopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MentorSubTopicResponse>> Handle(GetUnpublishedSubTopicsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetUnpublishedSubTopicsForMentorAsync(request.MentorId, cancellationToken);
    }
}