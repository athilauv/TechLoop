using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Discussions.Commands.DeleteDiscussion;

public sealed class DeleteDiscussionCommandHandler : IRequestHandler<DeleteDiscussionCommand, bool>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICurrentUserService _currentUser;

    public DeleteDiscussionCommandHandler(IDiscussionRepository discussionRepository, ICurrentUserService currentUser)
    {
        _discussionRepository = discussionRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(DeleteDiscussionCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var discussion = await _discussionRepository.GetEntityByIdAsync(request.Id);
        if (discussion is null)
        {
            throw new KeyNotFoundException("Discussion not found.");
        }

        var deleted = await _discussionRepository.DeleteAsync(request.Id, _currentUser.UserId);
        if (!deleted)
        {
            throw new InvalidOperationException("Failed to delete discussion.");
        }

        return true;
    }
}