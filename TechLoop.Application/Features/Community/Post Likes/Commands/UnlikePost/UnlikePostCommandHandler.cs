using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Community.PostLikes.Commands.UnlikePost;

public sealed class UnlikePostCommandHandler
    : IRequestHandler<UnlikePostCommand, bool>
{
    private readonly IPostLikeRepository _postLikeRepository;
    private readonly ICommunityPostRepository _postRepository;
    private readonly ICurrentUserService _currentUser;

    public UnlikePostCommandHandler(
        IPostLikeRepository postLikeRepository,
        ICommunityPostRepository postRepository,
        ICurrentUserService currentUser)
    {
        _postLikeRepository = postLikeRepository;
        _postRepository = postRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(UnlikePostCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var post = await _postRepository.GetEntityByIdAsync(request.PostId);
        if (post is null)
        {
            throw new KeyNotFoundException("Post not found.");
        }

        var exists = await _postLikeRepository.ExistsAsync(request.PostId, _currentUser.UserId);
        if (!exists)
        {
            throw new InvalidOperationException("Post is not liked.");
        }

        var removed = await _postLikeRepository.UnlikeAsync(request.PostId, _currentUser.UserId);
        if (!removed)
        {
            throw new InvalidOperationException("Failed to unlike post.");
        }

        return true;
    }
}