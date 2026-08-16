using MediatR;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Features.Topics.Queries.GetUnpublishedTopics;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Topics.Queries.Mentor.GetUnpublishedTopics;

public sealed class GetUnpublishedTopicsQueryHandler : IRequestHandler<GetUnpublishedTopicsQuery, IEnumerable<MentorTopicResponse>>
{
    private readonly ITopicsRepository _repository;
    public GetUnpublishedTopicsQueryHandler(ITopicsRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MentorTopicResponse>> Handle(GetUnpublishedTopicsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetUnpublishedTopicsForMentorAsync(request.MentorId, cancellationToken);
    }
}