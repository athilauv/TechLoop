using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Community.CommunityPosts.Queries.GetFeed;

public sealed class GetFeedQueryHandler : IRequestHandler<GetFeedQuery, PagedResult<CommunityPostDto>>
{
    private readonly ICommunityPostRepository _postRepository;
    public GetFeedQueryHandler(ICommunityPostRepository postRepository) => _postRepository=postRepository;
    public Task<PagedResult<CommunityPostDto>> Handle(GetFeedQuery request, CancellationToken cancellationToken)
        => _postRepository.GetFeedAsync(request.Page, request.PageSize, request.TechnologyId, request.Search, request.Sort);
}
