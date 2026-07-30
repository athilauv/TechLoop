using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TopicContributions.Queries.GetMyTopicContributions;

public sealed class GetMyTopicContributionsQueryHandler : IRequestHandler<GetMyTopicContributionsQuery, IEnumerable<TopicContributionSummaryResponse>>
{
    private readonly ITopicContributionRepository _repository;
    public GetMyTopicContributionsQueryHandler(ITopicContributionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TopicContributionSummaryResponse>> Handle(GetMyTopicContributionsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMyContributionsAsync(request.Request.LearnerId, cancellationToken);
    }
}