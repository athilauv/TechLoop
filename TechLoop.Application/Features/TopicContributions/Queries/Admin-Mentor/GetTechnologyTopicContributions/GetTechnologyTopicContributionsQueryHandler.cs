using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TopicContributions.Queries.GetTechnologyTopicContributions;

public sealed class GetTechnologyTopicContributionsQueryHandler : IRequestHandler<GetTechnologyTopicContributionsQuery, IEnumerable<TopicContributionResponse>>
{
    private readonly ITopicContributionRepository _repository;
    public GetTechnologyTopicContributionsQueryHandler(ITopicContributionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TopicContributionResponse>> Handle(GetTechnologyTopicContributionsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetTechnologyContributionsAsync(request.Request.TechnologyId, cancellationToken);
    }
}