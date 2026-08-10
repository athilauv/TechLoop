using MediatR;

namespace TechLoop.Application.Features.Community.PostLikes.Commands.UnlikePost;

public sealed record UnlikePostCommand(int PostId) : IRequest<bool>;