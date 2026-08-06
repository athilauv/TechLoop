using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Discussions.Queries.GetCommentById;

public sealed class GetCommentByIdQueryHandler
    : IRequestHandler<GetCommentByIdQuery, DiscussionCommentDto>
{
    private readonly IDiscussionCommentRepository _commentRepository;

    public GetCommentByIdQueryHandler(
        IDiscussionCommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<DiscussionCommentDto> Handle(
        GetCommentByIdQuery request,
        CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetByIdAsync(request.Id);

        if (comment is null)
        {
            throw new KeyNotFoundException("Comment not found.");
        }

        return comment;
    }
}