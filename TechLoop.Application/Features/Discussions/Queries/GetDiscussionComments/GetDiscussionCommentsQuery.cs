using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;

namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussionComments;

public sealed record GetDiscussionCommentsQuery(int DiscussionId) : IRequest<IEnumerable<DiscussionCommentDto>>;