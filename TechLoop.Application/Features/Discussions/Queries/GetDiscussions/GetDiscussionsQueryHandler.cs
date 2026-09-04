using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussions;
public sealed class GetDiscussionsQueryHandler : IRequestHandler<GetDiscussionsQuery, PagedResult<DiscussionDto>>
{
    private readonly IDiscussionRepository _discussionRepository;
    public GetDiscussionsQueryHandler(IDiscussionRepository discussionRepository) => _discussionRepository=discussionRepository;
    public Task<PagedResult<DiscussionDto>> Handle(GetDiscussionsQuery request, CancellationToken cancellationToken)
        => _discussionRepository.GetAllAsync(request.Page, request.PageSize, request.Search, request.Sort);
}
