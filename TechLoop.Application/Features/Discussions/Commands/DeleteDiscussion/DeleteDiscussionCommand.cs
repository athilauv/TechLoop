using MediatR;

namespace TechLoop.Application.Features.Discussions.Commands.DeleteDiscussion;

public sealed record DeleteDiscussionCommand(int Id ) : IRequest<bool>;