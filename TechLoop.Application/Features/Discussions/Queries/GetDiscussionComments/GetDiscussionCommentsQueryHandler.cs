using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussionComments;

public sealed class GetDiscussionCommentsQueryHandler : IRequestHandler<GetDiscussionCommentsQuery, IEnumerable<DiscussionCommentDto>>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IDiscussionCommentRepository _commentRepository;

    public GetDiscussionCommentsQueryHandler(IDiscussionRepository discussionRepository, IDiscussionCommentRepository commentRepository)
    {
        _discussionRepository = discussionRepository;
        _commentRepository = commentRepository;
    }

    public async Task<IEnumerable<DiscussionCommentDto>> Handle(GetDiscussionCommentsQuery request, CancellationToken cancellationToken)
    {
        var discussion = await _discussionRepository.GetByIdAsync(request.DiscussionId);
        if (discussion is null)
        {
            throw new KeyNotFoundException("Discussion not found.");
        }

        return await _commentRepository.GetByDiscussionIdAsync(request.DiscussionId);
    }
}