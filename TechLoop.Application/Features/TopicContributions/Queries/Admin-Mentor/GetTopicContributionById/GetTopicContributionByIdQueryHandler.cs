using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TopicContributions.Queries.GetTopicContributionById;

public sealed class GetTopicContributionByIdQueryHandler : IRequestHandler<GetTopicContributionByIdQuery, TopicContributionResponse?>
{
    private readonly ITopicContributionRepository _repository;
    public GetTopicContributionByIdQueryHandler(ITopicContributionRepository repository)
    {
        _repository = repository;
    }

    public async Task<TopicContributionResponse?> Handle(GetTopicContributionByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetByIdAsync(request.Request.Id, cancellationToken);
    }
}