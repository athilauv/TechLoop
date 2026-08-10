using MediatR;
using TechLoop.Application.Features.Community.PostComments.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Community.PostComments.Queries.GetCommentById;

public sealed class GetCommentByIdQueryHandler
    : IRequestHandler<GetCommentByIdQuery, PostCommentDto>
{
    private readonly IPostCommentRepository _commentRepository;

    public GetCommentByIdQueryHandler(IPostCommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<PostCommentDto> Handle(
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