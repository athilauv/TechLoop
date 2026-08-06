using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussions;

public sealed class GetDiscussionsQueryHandler : IRequestHandler<GetDiscussionsQuery, IEnumerable<DiscussionDto>>
{
    private readonly IDiscussionRepository _discussionRepository;
    public GetDiscussionsQueryHandler(IDiscussionRepository discussionRepository)
    {
        _discussionRepository = discussionRepository;
    }

    public async Task<IEnumerable<DiscussionDto>> Handle(GetDiscussionsQuery request, CancellationToken cancellationToken)
    {
        var discussions = await _discussionRepository.GetAllAsync();
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