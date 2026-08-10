using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Community.CommunityPosts.Commands.CreatePost;

public sealed class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, CommunityPostDto>
{
    private readonly ICommunityPostRepository _postRepository;
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUser;

    public CreatePostCommandHandler(
        ICommunityPostRepository postRepository,
        ITechnologyRepository technologyRepository,
        ICurrentUserService currentUser)
    {
        _postRepository = postRepository;
        _technologyRepository = technologyRepository;
        _currentUser = currentUser;
    }

    public async Task<CommunityPostDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        if (request.TechnologyId.HasValue)
        {
            var technology = await _technologyRepository.GetByIdAsync(request.TechnologyId.Value, cancellationToken);
            if (technology is null)
            {
                throw new KeyNotFoundException("Technology not found.");
            }
        }

        var post = new CommunityPost
        {
            UserId = _currentUser.UserId,
            TechnologyId = request.TechnologyId,
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            CreatedBy = _currentUser.UserId
        };

        var postId = await _postRepository.CreateAsync(post);
        if (postId <= 0)
        {
            throw new InvalidOperationException("Failed to create post.");
        }

        var createdPost = await _postRepository.GetByIdAsync(postId);
        if (createdPost is null)
        {
            throw new KeyNotFoundException("Post not found.");
        }

        return createdPost;
    }
}