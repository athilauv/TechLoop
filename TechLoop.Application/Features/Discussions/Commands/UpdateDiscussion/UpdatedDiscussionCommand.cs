using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;

namespace TechLoop.Application.Features.Discussions.Commands.UpdateDiscussion;

public sealed record UpdatedDiscussionCommand(int Id, string Title, string Content ) : IRequest<DiscussionDto>;