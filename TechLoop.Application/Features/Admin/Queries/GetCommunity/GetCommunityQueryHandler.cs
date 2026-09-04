using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Application.Interfaces.Repositories;
namespace TechLoop.Application.Features.Admin.Queries.GetCommunity;
public sealed class GetCommunityQueryHandler : IRequestHandler<GetCommunityQuery, PagedResult<CommunityPostDto>>
{
    private readonly ICommunityPostRepository _repository;
    public GetCommunityQueryHandler(ICommunityPostRepository repository) => _repository=repository;
    public Task<PagedResult<CommunityPostDto>> Handle(GetCommunityQuery request, CancellationToken cancellationToken)
        => _repository.GetFeedAsync(request.Page, request.PageSize, request.TechnologyId, request.Search, request.Sort);
}
