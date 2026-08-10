using MediatR;
using TechLoop.Application.Features.Community.PostComments.DTOs;

namespace TechLoop.Application.Features.Community.PostComments.Queries.GetPostComments;

public sealed record GetPostCommentsQuery(int PostId)
    : IRequest<IEnumerable<PostCommentDto>>;