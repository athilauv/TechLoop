using MediatR;

namespace TechLoop.Application.Features.Discussions.Commands.UnpinDiscussion;

public sealed record UnpinDiscussionCommand(
    int Id
) : IRequest<bool>;