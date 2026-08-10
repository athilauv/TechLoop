using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Community.CommunityPosts.Commands.DeletePost;

public sealed class DeletePostCommandHandler
    : IRequestHandler<DeletePostCommand, bool>
{
    private readonly ICommunityPostRepository _postRepository;
    private readonly ICurrentUserService _currentUser;

    public DeletePostCommandHandler(
        ICommunityPostRepository postRepository,
        ICurrentUserService currentUser)
    {
        _postRepository = postRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(
        DeletePostCommand request,
        CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var post = await _postRepository.GetEntityByIdAsync(request.Id);

        if (post is null)
        {
            throw new KeyNotFoundException("Post not found.");
        }

        if (post.UserId != _currentUser.UserId)
        {
            throw new UnauthorizedAccessException("You are not allowed to delete this post.");
        }

        var deleted = await _postRepository.DeleteAsync(
            request.Id,
            _currentUser.UserId);

        if (!deleted)
        {
            throw new InvalidOperationException("Failed to delete post.");
        }

        return deleted;
    }
}