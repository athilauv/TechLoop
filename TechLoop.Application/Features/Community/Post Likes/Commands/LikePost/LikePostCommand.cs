using MediatR;

namespace TechLoop.Application.Features.Community.PostLikes.Commands.LikePost;

public sealed record LikePostCommand(int PostId) : IRequest<bool>;