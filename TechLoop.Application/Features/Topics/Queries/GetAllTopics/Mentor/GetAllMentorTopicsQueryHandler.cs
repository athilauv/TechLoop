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
        return await _repository.GetAllMentorAsync(cancellationToken);
    }
}