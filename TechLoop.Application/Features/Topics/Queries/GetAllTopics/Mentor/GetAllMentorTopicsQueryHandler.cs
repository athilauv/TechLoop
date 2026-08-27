using MediatR;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Topics.Queries.GetAllTopics.Mentor;

public sealed class GetAllMentorTopicsQueryHandler : IRequestHandler<GetAllMentorTopicsQuery, IEnumerable<MentorTopicResponse>>
{
    private readonly ITopicsRepository _repository;
    private readonly ICurrentUserService _currentUser;

    public GetAllMentorTopicsQueryHandler(
        ITopicsRepository repository,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<IEnumerable<MentorTopicResponse>> Handle(GetAllMentorTopicsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetAllMentorAsync(_currentUser.UserId, cancellationToken);
    }
}