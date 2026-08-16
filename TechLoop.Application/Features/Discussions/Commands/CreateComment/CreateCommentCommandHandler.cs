using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.DiscussionComments.Commands.CreateComment;

public sealed class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, DiscussionCommentDto>
{
    private readonly IDiscussionCommentRepository _commentRepository;
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICurrentUserService _currentUser;

    public CreateCommentCommandHandler(
        IDiscussionCommentRepository commentRepository,
        IDiscussionRepository discussionRepository,
        ICurrentUserService currentUser)
    {
        _commentRepository = commentRepository;
        _discussionRepository = discussionRepository;
        _currentUser = currentUser;
    }

    public async Task<DiscussionCommentDto> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
            throw new UnauthorizedAccessException("User is not authenticated.");

        if (request.DiscussionId <= 0)
            throw new ArgumentException("Invalid discussion id.");

        if (string.IsNullOrWhiteSpace(request.Content))
            throw new ArgumentException("Comment content is required.");

        var discussion = await _discussionRepository.GetEntityByIdAsync(request.DiscussionId);
        if (discussion is null)
            throw new NotFoundException("Discussion not found.");

        if (discussion.IsLocked)
            throw new InvalidOperationException("This discussion is locked.");

        if (request.ParentCommentId.HasValue)
        {
            var parentComment = await _commentRepository.GetEntityByIdAsync(request.ParentCommentId.Value);
            if (parentComment is null)
                throw new NotFoundException("Parent comment not found.");

            if (parentComment.DiscussionId != request.DiscussionId)
                throw new InvalidOperationException("Parent comment does not belong to this discussion.");
        }

        var comment = new DiscussionComment
        {
            DiscussionId = request.DiscussionId,
            UserId = _currentUser.UserId,
            ParentCommentId = request.ParentCommentId,
            Content = request.Content.Trim(),
            CreatedBy = _currentUser.UserId
        };

        var commentId = await _commentRepository.CreateAsync(comment);
        if (commentId <= 0)
            throw new InvalidOperationException("Failed to create comment.");

        var createdComment = await _commentRepository.GetByIdAsync(commentId);
        if (createdComment is null)
            throw new NotFoundException("Comment not found.");

        return createdComment;
    }
}