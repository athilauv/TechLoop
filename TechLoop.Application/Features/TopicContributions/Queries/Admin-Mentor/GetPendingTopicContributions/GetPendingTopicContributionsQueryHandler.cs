using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Features.TopicContributions.Queries.GetPendingTopicContributions;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TopicContributions.Queries.Mentor.GetPendingTopicContributions;
public sealed class GetPendingTopicContributionsQueryHandler : IRequestHandler< GetPendingTopicContributionsQuery, IEnumerable<TopicContributionPendingResponse>>
{
    private readonly ITopicContributionRepository _repository;
    public GetPendingTopicContributionsQueryHandler( ITopicContributionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TopicContributionPendingResponse>> Handle(GetPendingTopicContributionsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetPendingContributionsAsync(request.MentorId, cancellationToken);
    }
}