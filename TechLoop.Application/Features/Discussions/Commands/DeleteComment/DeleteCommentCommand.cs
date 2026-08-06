using MediatR;

namespace TechLoop.Application.Features.Discussions.Commands.DeleteComment;

public sealed record DeleteCommentCommand(int Id) : IRequest<bool>;