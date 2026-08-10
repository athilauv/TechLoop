using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Community.SavedPosts.Commands.SavePost;

public sealed class SavePostCommandHandler
    : IRequestHandler<SavePostCommand, bool>
{
    private readonly ISavedPostRepository _savedPostRepository;
    private readonly ICommunityPostRepository _postRepository;
    private readonly ICurrentUserService _currentUser;

    public SavePostCommandHandler(
        ISavedPostRepository savedPostRepository,
        ICommunityPostRepository postRepository,
        ICurrentUserService currentUser)
    {
        _savedPostRepository = savedPostRepository;
        _postRepository = postRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(
        SavePostCommand request,
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

        var alreadySaved = await _savedPostRepository.ExistsAsync(
            request.PostId,
            _currentUser.UserId);

        if (alreadySaved)
        {
            throw new InvalidOperationException("Post already saved.");
        }

        var savedPost = new SavedPost
        {
            PostId = request.PostId,
            UserId = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _savedPostRepository.SaveAsync(savedPost);

        if (result <= 0)
        {
            throw new InvalidOperationException("Failed to save post.");
        }

        return true;
    }
}