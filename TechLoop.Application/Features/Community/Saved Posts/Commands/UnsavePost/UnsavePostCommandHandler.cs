using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Community.SavedPosts.Commands.UnsavePost;

public sealed class UnsavePostCommandHandler
    : IRequestHandler<UnsavePostCommand, bool>
{
    private readonly ISavedPostRepository _savedPostRepository;
    private readonly ICommunityPostRepository _postRepository;
    private readonly ICurrentUserService _currentUser;

    public UnsavePostCommandHandler(
        ISavedPostRepository savedPostRepository,
        ICommunityPostRepository postRepository,
        ICurrentUserService currentUser)
    {
        _savedPostRepository = savedPostRepository;
        _postRepository = postRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(
        UnsavePostCommand request,
        CancellationToken cancellationToken)
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

        var exists = await _savedPostRepository.ExistsAsync(
            request.PostId,
            _currentUser.UserId);

        if (!exists)
        {
            throw new InvalidOperationException("Post is not saved.");
        }

        var removed = await _savedPostRepository.UnsaveAsync(
            request.PostId,
            _currentUser.UserId);

        if (!removed)
        {
            throw new InvalidOperationException("Failed to unsave post.");
        }

        return true;
    }
}