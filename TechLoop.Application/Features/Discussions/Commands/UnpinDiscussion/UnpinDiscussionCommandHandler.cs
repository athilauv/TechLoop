using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Discussions.Commands.UnpinDiscussion;

public sealed class UnpinDiscussionCommandHandler : IRequestHandler<UnpinDiscussionCommand, bool>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUser;

    public UnpinDiscussionCommandHandler(
        IDiscussionRepository discussionRepository,
        IQuestionRepository questionRepository,
        ICurrentUserService currentUser)
    {
        _discussionRepository = discussionRepository;
        _questionRepository = questionRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(sgitUnpinDiscussionCommand request, CancellationToken cancellationToken)
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

        if (!discussion.IsPinned)
        {
            throw new InvalidOperationException("Discussion is not pinned.");
        }

        var questionTechnologyId = await _questionRepository.GetQuestionTechnologyIdAsync(discussion.QuestionId, cancellationToken);
        if (questionTechnologyId is null)
        {
            throw new KeyNotFoundException("Question technology not found.");
        }

        var mentorTechnologyId = await _questionRepository.GetMentorTechnologyIdAsync(_currentUser.UserId, cancellationToken);
        if (mentorTechnologyId is null)
        {
            throw new UnauthorizedAccessException("Mentor technology not found.");
        }

        if (questionTechnologyId != mentorTechnologyId)
        {
            throw new UnauthorizedAccessException("You are not authorized to unpin this discussion.");
        }

        var unpinned = await _discussionRepository.PinAsync(request.Id, false, _currentUser.UserId);
        if (!unpinned)
        {
            throw new InvalidOperationException("Failed to unpin discussion.");
        }

        return true;
    }
}