using MediatR;

namespace TechLoop.Application.Features.Community.SavedPosts.Commands.SavePost;

public sealed record SavePostCommand(int PostId) : IRequest<bool>;