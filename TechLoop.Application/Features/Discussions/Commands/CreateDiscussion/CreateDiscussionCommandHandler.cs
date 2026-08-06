using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Discussions.Commands.CreateDiscussion;

public sealed class CreateDiscussionCommandHandler
    : IRequestHandler<CreateDiscussionCommand, DiscussionDto>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUser;

    public CreateDiscussionCommandHandler(
        IDiscussionRepository discussionRepository,
        IQuestionRepository questionRepository,
        ICurrentUserService currentUser)
    {
        _discussionRepository = discussionRepository;
        _questionRepository = questionRepository;
        _currentUser = currentUser;
    }

    public async Task<DiscussionDto> Handle(
        CreateDiscussionCommand request,
        CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var question = await _questionRepository.GetByIdAsync(
            request.QuestionId,
            cancellationToken);

        if (question is null)
        {
            throw new KeyNotFoundException("Question not found.");
        }

        var discussion = new Discussion
        {
            UserId = _currentUser.UserId,
            QuestionId = request.QuestionId,
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            CreatedBy = _currentUser.UserId
        };

        var discussionId = await _discussionRepository.CreateAsync(discussion);

        if (discussionId <= 0)
        {
            throw new InvalidOperationException("Failed to create discussion.");
        }

        var createdDiscussion = await _discussionRepository.GetByIdAsync(discussionId);

        if (createdDiscussion is null)
        {
            throw new KeyNotFoundException("Discussion not found.");
        }

        return createdDiscussion;
    }
}