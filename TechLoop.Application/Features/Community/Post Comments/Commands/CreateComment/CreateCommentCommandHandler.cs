using MediatR;
using TechLoop.Application.Features.Community.PostComments.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Community.PostComments.Commands.CreateComment;

public sealed class CreateCommentCommandHandler
    : IRequestHandler<CreateCommentCommand, PostCommentDto>
{
    private readonly IPostCommentRepository _commentRepository;
    private readonly ICommunityPostRepository _postRepository;
    private readonly ICurrentUserService _currentUser;

    public CreateCommentCommandHandler(
        IPostCommentRepository commentRepository,
        ICommunityPostRepository postRepository,
        ICurrentUserService currentUser)
    {
        _commentRepository = commentRepository;
        _postRepository = postRepository;
        _currentUser = currentUser;
    }

    public async Task<PostCommentDto> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        if (string.IsNullOrWhiteSpace(request.Content))
        {
            throw new ArgumentException("Comment content is required.");
        }

        var post = await _postRepository.GetEntityByIdAsync(request.PostId);
        if (post is null)
        {
            throw new KeyNotFoundException("Post not found.");
        }

        if (request.ParentCommentId.HasValue)
        {
            var parentComment = await _commentRepository.GetEntityByIdAsync(request.ParentCommentId.Value);
            if (parentComment is null)
            {
                throw new KeyNotFoundException("Parent comment not found.");
            }

            if (parentComment.PostId != request.PostId)
            {
                throw new InvalidOperationException("Parent comment does not belong to this post.");
            }
        }

        var comment = new PostComment
        {
            PostId = request.PostId,
            UserId = _currentUser.UserId,
            ParentCommentId = request.ParentCommentId,
            Content = request.Content.Trim(),
            CreatedBy = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow
        };

        var commentId = await _commentRepository.CreateAsync(comment);
        if (commentId <= 0)
        {
            throw new InvalidOperationException("Failed to create comment.");
        }

        var createdComment = await _commentRepository.GetByIdAsync(commentId);
        if (createdComment is null)
        {
            throw new KeyNotFoundException("Created comment could not be retrieved.");
        }

        return createdComment;
    }
}