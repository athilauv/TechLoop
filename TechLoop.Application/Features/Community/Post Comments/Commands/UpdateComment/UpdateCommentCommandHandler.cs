using MediatR;
using TechLoop.Application.Features.Community.PostComments.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Community.PostComments.Commands.UpdateComment;

public sealed class UpdateCommentCommandHandler : IRequestHandler<UpdateCommentCommand, PostCommentDto>
{
    private readonly IPostCommentRepository _commentRepository;
    private readonly ICurrentUserService _currentUser;

    public UpdateCommentCommandHandler(IPostCommentRepository commentRepository, ICurrentUserService currentUser)
    {
        _commentRepository = commentRepository;
        _currentUser = currentUser;
    }

    public async Task<PostCommentDto> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var comment = await _commentRepository.GetEntityByIdAsync(request.Id);
        if (comment is null)
        {
            throw new KeyNotFoundException("Comment not found.");
        }

        if (comment.UserId != _currentUser.UserId)
        {
            throw new UnauthorizedAccessException("You are not allowed to update this comment.");
        }

        comment.Content = request.Content.Trim();
        comment.UpdatedBy = _currentUser.UserId;
        comment.UpdatedAt = DateTime.UtcNow;

        var updated = await _commentRepository.UpdateAsync(comment);
        if (!updated)
        {
            throw new InvalidOperationException("Failed to update comment.");
        }

        var updatedComment = await _commentRepository.GetByIdAsync(request.Id);
        if (updatedComment is null)
        {
            throw new KeyNotFoundException("Comment not found.");
        }

        return updatedComment;
    }
}