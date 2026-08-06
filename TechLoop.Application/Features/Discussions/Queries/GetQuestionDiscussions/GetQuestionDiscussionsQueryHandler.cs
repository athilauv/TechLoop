using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Discussions.Queries.GetQuestionDiscussions;

public sealed class GetQuestionDiscussionsQueryHandler : IRequestHandler<GetQuestionDiscussionsQuery, IEnumerable<DiscussionDto>>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IQuestionRepository _questionRepository;

    public GetQuestionDiscussionsQueryHandler(IDiscussionRepository discussionRepository, IQuestionRepository questionRepository)
    {
        _discussionRepository = discussionRepository;
        _questionRepository = questionRepository;
    }

    public async Task<IEnumerable<DiscussionDto>> Handle(GetQuestionDiscussionsQuery request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.QuestionId, cancellationToken);
        if (question is null)
        {
            throw new KeyNotFoundException("Question not found.");
        }

        var discussions = await _discussionRepository.GetByQuestionIdAsync(request.QuestionId);
        return discussions.Select(d => new DiscussionDto
        {
            Id = d.Id,
            UserId = d.UserId,
            QuestionId = d.QuestionId,
            Title = d.Title,
            Content = d.Content,
            IsPinned = d.IsPinned,
            IsLocked = d.IsLocked,
            CreatedAt = d.CreatedAt
        });
    }
}