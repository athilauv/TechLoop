using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;

namespace TechLoop.Application.Features.DiscussionComments.Commands.CreateComment;

public sealed record CreateCommentCommand(
    int DiscussionId,
    int? ParentCommentId,
    string Content
) : IRequest<DiscussionCommentDto>;