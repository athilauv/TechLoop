using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;

namespace TechLoop.Application.Features.Discussions.Commands.CreateDiscussion;

public sealed record CreateDiscussionCommand(int QuestionId, string Title, string Content ) : IRequest<DiscussionDto>;