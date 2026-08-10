using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Community.CommunityPosts.Queries.GetFeed;

public sealed class GetFeedQueryHandler : IRequestHandler<GetFeedQuery, IEnumerable<CommunityPostDto>>
{
    private readonly ICommunityPostRepository _postRepository;

    public GetFeedQueryHandler(ICommunityPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<IEnumerable<CommunityPostDto>> Handle(
        GetFeedQuery request,
        CancellationToken cancellationToken)
    {
        return await _postRepository.GetFeedAsync();
    }
}