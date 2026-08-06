using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussions;

public sealed class GetDiscussionsQueryHandler
    : IRequestHandler<GetDiscussionsQuery, IEnumerable<DiscussionDto>>
{
    private readonly IDiscussionRepository _discussionRepository;

    public GetDiscussionsQueryHandler(IDiscussionRepository discussionRepository)
    {
        _discussionRepository = discussionRepository;
    }

    public async Task<IEnumerable<DiscussionDto>> Handle(
        GetDiscussionsQuery request,
        CancellationToken cancellationToken)
    {
        return await _discussionRepository.GetAllAsync();
    }
}