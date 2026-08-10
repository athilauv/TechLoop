using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Community.CommunityPosts.Commands.UpdatePost;

public sealed class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand, CommunityPostDto>
{
    private readonly ICommunityPostRepository _postRepository;
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUser;

    public UpdatePostCommandHandler(
        ICommunityPostRepository postRepository,
        ITechnologyRepository technologyRepository,
        ICurrentUserService currentUser)
    {
        _postRepository = postRepository;
        _technologyRepository = technologyRepository;
        _currentUser = currentUser;
    }

    public async Task<CommunityPostDto> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
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
            throw new UnauthorizedAccessException("You are not allowed to update this post.");
        }

        if (request.TechnologyId.HasValue)
        {
            var technology = await _technologyRepository.GetByIdAsync(request.TechnologyId.Value, cancellationToken);
            if (technology is null)
            {
                throw new KeyNotFoundException("Technology not found.");
            }
        }

        post.TechnologyId = request.TechnologyId;
        post.Title = request.Title.Trim();
        post.Content = request.Content.Trim();
        post.UpdatedBy = _currentUser.UserId;
        post.UpdatedAt = DateTime.UtcNow;

        var updated = await _postRepository.UpdateAsync(post);
        if (!updated)
        {
            throw new InvalidOperationException("Failed to update post.");
        }

        var updatedPost = await _postRepository.GetByIdAsync(request.Id);
        if (updatedPost is null)
        {
            throw new KeyNotFoundException("Post not found.");
        }

        return updatedPost;
    }
}