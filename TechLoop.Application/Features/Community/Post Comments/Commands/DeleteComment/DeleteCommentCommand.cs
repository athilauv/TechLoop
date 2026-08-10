using MediatR;

namespace TechLoop.Application.Features.Community.PostComments.Commands.DeleteComment;

public sealed record DeleteCommentCommand(int Id) : IRequest<bool>;