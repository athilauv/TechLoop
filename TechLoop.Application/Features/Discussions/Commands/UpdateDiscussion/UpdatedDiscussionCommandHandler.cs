using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Discussions.Commands.UpdateDiscussion;

public sealed class UpdatedDiscussionCommandHandler : IRequestHandler<UpdatedDiscussionCommand, DiscussionDto>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICurrentUserService _currentUser;

    public UpdatedDiscussionCommandHandler(IDiscussionRepository discussionRepository, ICurrentUserService currentUser)
    {
        _discussionRepository = discussionRepository;
        _currentUser = currentUser;
    }

    public async Task<DiscussionDto> Handle(UpdatedDiscussionCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var discussion =await _discussionRepository.GetEntityByIdAsync(request.Id);
        if (discussion is null)
        {
            throw new KeyNotFoundException("Discussion not found.");
        }

        if (discussion.UserId != _currentUser.UserId)
        {
            throw new UnauthorizedAccessException("You are not allowed to update this discussion.");
        }

        discussion.Title = request.Title.Trim();
        discussion.Content = request.Content.Trim();
        discussion.UpdatedBy = _currentUser.UserId;

        var updated = await _discussionRepository.UpdateAsync(discussion);
        if (!updated)
        {
            throw new InvalidOperationException("Failed to update discussion.");
        }

        var updatedDiscussion = await _discussionRepository.GetByIdAsync(request.Id);
        if (updatedDiscussion is null)
        {
            throw new KeyNotFoundException("Discussion not found.");
        }

        return new DiscussionDto
        {
            Id = updatedDiscussion.Id,
            UserId = updatedDiscussion.UserId,
            QuestionId = updatedDiscussion.QuestionId,
            Title = updatedDiscussion.Title,
            Content = updatedDiscussion.Content,
            IsPinned = updatedDiscussion.IsPinned,
            IsLocked = updatedDiscussion.IsLocked,
            CreatedAt = updatedDiscussion.CreatedAt
        };
    }
}