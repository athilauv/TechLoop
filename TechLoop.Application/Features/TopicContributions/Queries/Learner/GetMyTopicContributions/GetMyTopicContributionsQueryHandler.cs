using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.TopicContributions.Queries.Learner.GetMyTopicContributions;

public sealed class GetMyTopicContributionsQueryHandler : IRequestHandler<GetMyTopicContributionsQuery, IEnumerable<TopicContributionSummaryResponse>>
{
    private readonly ITopicContributionRepository _repository;
    private readonly ICurrentUserService _currentUser;
    public GetMyTopicContributionsQueryHandler(ITopicContributionRepository repository, ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<IEnumerable<TopicContributionSummaryResponse>> Handle(GetMyTopicContributionsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMyContributionsAsync(_currentUser.UserId, cancellationToken);
    }
}