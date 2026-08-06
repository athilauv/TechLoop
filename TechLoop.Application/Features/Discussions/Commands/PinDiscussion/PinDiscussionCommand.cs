using MediatR;

namespace TechLoop.Application.Features.Discussions.Commands.PinDiscussion;

public sealed record PinDiscussionCommand(int Id, bool IsPinned ) : IRequest<bool>;