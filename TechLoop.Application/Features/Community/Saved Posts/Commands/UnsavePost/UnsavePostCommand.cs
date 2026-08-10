using MediatR;

namespace TechLoop.Application.Features.Community.SavedPosts.Commands.UnsavePost;

public sealed record UnsavePostCommand(int PostId) : IRequest<bool>;