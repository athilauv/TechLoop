using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Queries.GetPendingContributions;

public sealed class GetPendingContributionsQueryHandler : IRequestHandler<GetPendingContributionsQuery, IEnumerable<TopicContributionPendingResponse>>
{
    private readonly IAdminRepository _repository;

    public GetPendingContributionsQueryHandler(IAdminRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<TopicContributionPendingResponse>> Handle(GetPendingContributionsQuery request, CancellationToken cancellationToken)
    {
        return _repository.GetPendingContributionsAsync(cancellationToken);
    }
}
