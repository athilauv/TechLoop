using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Discussions.Commands.UpdateComment;

public sealed class UpdateCommentCommandHandler : IRequestHandler<UpdateCommentCommand, bool>
{
    private readonly IDiscussionCommentRepository _commentRepository;
    private readonly ICurrentUserService _currentUser;

    public UpdateCommentCommandHandler(
        IDiscussionCommentRepository commentRepository,
        ICurrentUserService currentUser)
    {
        _commentRepository = commentRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
            throw new UnauthorizedAccessException("User is not authenticated.");

        if (request.Id <= 0)
            throw new ArgumentException("Invalid comment id.");

        if (string.IsNullOrWhiteSpace(request.Content))
            throw new ArgumentException("Comment content is required.");

        var existingComment = await _commentRepository.GetByIdAsync(request.Id);

        if (existingComment is null)
            throw new KeyNotFoundException("Comment not found.");

        if (existingComment.UserId != _currentUser.UserId)
            throw new UnauthorizedAccessException("You are not allowed to update this comment.");

        var comment = new DiscussionComment
        {
            Id = request.Id,
            Content = request.Content.Trim(),
            UpdatedBy = _currentUser.UserId,
            UpdatedAt = DateTime.UtcNow
        };

        var updated = await _commentRepository.UpdateAsync(comment);
        if (!updated)
            throw new InvalidOperationException("Failed to update comment.");

        return true;
    }
}