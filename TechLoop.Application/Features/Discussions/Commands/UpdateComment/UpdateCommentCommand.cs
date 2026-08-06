using MediatR;

namespace TechLoop.Application.Features.Discussions.Commands.UpdateComment;

public sealed record UpdateCommentCommand(
    int Id,
    string Content
) : IRequest<bool>;