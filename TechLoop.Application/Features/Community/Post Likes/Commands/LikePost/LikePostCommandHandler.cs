using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Community.PostLikes.Commands.LikePost;

public sealed class LikePostCommandHandler
    : IRequestHandler<LikePostCommand, bool>
{
    private readonly IPostLikeRepository _postLikeRepository;
    private readonly ICommunityPostRepository _postRepository;
    private readonly ICurrentUserService _currentUser;

    public LikePostCommandHandler(
        IPostLikeRepository postLikeRepository,
        ICommunityPostRepository postRepository,
        ICurrentUserService currentUser)
    {
        _postLikeRepository = postLikeRepository;
        _postRepository = postRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(LikePostCommand request, CancellationToken cancellationToken)
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

        var alreadyLiked = await _postLikeRepository.ExistsAsync(request.PostId, _currentUser.UserId);
        if (alreadyLiked)
        {
            throw new InvalidOperationException("You have already liked this post.");
        }

        var like = new PostLike
        {
            PostId = request.PostId,
            UserId = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow
        };

        var likeId = await _postLikeRepository.LikeAsync(like);
        if (likeId <= 0)
        {
            throw new InvalidOperationException("Failed to like post.");
        }

        return true;
    }
}