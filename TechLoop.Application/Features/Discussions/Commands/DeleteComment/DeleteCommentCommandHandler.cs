using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Discussions.Commands.DeleteComment;

public sealed class DeleteCommentCommandHandler
    : IRequestHandler<DeleteCommentCommand, bool>
{
    private readonly IDiscussionCommentRepository _commentRepository;
    private readonly ICurrentUserService _currentUser;

    public DeleteCommentCommandHandler(
        IDiscussionCommentRepository commentRepository,
        ICurrentUserService currentUser)
    {
        _commentRepository = commentRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(
        DeleteCommentCommand request,
        CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var comment = await _commentRepository.GetByIdAsync(request.Id);

        if (comment is null)
        {
            throw new KeyNotFoundException("Comment not found.");
        }

        if (comment.UserId != _currentUser.UserId)
        {
            throw new UnauthorizedAccessException(
                "You are not authorized to delete this comment.");
        }

        var deleted = await _commentRepository.DeleteAsync(
            request.Id,
            _currentUser.UserId);

        if (!deleted)
        {
            throw new InvalidOperationException(
                "Failed to delete comment.");
        }

        return true;
    }
}