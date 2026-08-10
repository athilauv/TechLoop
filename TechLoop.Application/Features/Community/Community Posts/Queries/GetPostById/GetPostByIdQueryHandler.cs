using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Community.CommunityPosts.Queries.GetPostById;

public sealed class GetPostByIdQueryHandler
    : IRequestHandler<GetPostByIdQuery, CommunityPostDto>
{
    private readonly ICommunityPostRepository _postRepository;

    public GetPostByIdQueryHandler(ICommunityPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<CommunityPostDto> Handle(
        GetPostByIdQuery request,
        CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetByIdAsync(request.Id);

        if (post is null)
        {
            throw new KeyNotFoundException("Post not found.");
        }

        return post;
    }
}