using MediatR;
using TechLoop.Application.Features.Community.PostComments.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Community.PostComments.Queries.GetPostComments;

public sealed class GetPostCommentsQueryHandler
    : IRequestHandler<GetPostCommentsQuery, IEnumerable<PostCommentDto>>
{
    private readonly IPostCommentRepository _commentRepository;

    public GetPostCommentsQueryHandler(IPostCommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<IEnumerable<PostCommentDto>> Handle(
        GetPostCommentsQuery request,
        CancellationToken cancellationToken)
    {
        return await _commentRepository.GetByPostIdAsync(request.PostId);
    }
}