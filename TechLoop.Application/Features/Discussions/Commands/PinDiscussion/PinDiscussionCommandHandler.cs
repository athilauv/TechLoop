using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Discussions.Commands.PinDiscussion;

public sealed class PinDiscussionCommandHandler : IRequestHandler<PinDiscussionCommand, bool>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUser;

    public PinDiscussionCommandHandler(IDiscussionRepository discussionRepository, IQuestionRepository questionRepository, ICurrentUserService currentUser)
    {
        _discussionRepository = discussionRepository;
        _questionRepository = questionRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(PinDiscussionCommand request, CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var discussion = await _discussionRepository.GetByIdAsync(request.Id);
        if (discussion is null)
        {
            throw new KeyNotFoundException("Discussion not found.");
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
            throw new UnauthorizedAccessException("You are not authorized to pin this discussion.");
        }

        var pinned = await _discussionRepository.PinAsync(request.Id, request.IsPinned, _currentUser.UserId);
        if (!pinned)
        {
            throw new InvalidOperationException("Failed to update discussion pin status.");
        }

        return true;
    }
}