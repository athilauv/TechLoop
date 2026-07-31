using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.TopicContributions.Queries.Learner.GetMyTopicContributionById;

public sealed class GetMyTopicContributionByIdQueryHandler
    : IRequestHandler<GetMyTopicContributionByIdQuery, TopicContributionResponse?>
{
    private readonly ITopicContributionRepository _repository;
    private readonly ICurrentUserService _currentUser;
    public GetMyTopicContributionByIdQueryHandler(ITopicContributionRepository repository, ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<TopicContributionResponse?> Handle(GetMyTopicContributionByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMyContributionByIdAsync(_currentUser.UserId, request.ContributionId, cancellationToken);
    }
}