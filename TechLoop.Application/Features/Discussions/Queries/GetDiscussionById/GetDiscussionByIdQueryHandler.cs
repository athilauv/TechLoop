using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussionById;

public sealed class GetDiscussionByIdQueryHandler
    : IRequestHandler<GetDiscussionByIdQuery, DiscussionDto>
{
    private readonly IDiscussionRepository _discussionRepository;

    public GetDiscussionByIdQueryHandler(
        IDiscussionRepository discussionRepository)
    {
        _discussionRepository = discussionRepository;
    }

    public async Task<DiscussionDto> Handle(
        GetDiscussionByIdQuery request,
        CancellationToken cancellationToken)
    {
        var discussion = await _discussionRepository.GetByIdAsync(request.Id);

        if (discussion is null)
        {
            throw new KeyNotFoundException("Discussion not found.");
        }

        return discussion;
    }
}