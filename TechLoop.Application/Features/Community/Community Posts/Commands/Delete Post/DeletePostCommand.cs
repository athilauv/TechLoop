using MediatR;

namespace TechLoop.Application.Features.Community.CommunityPosts.Commands.DeletePost;

public sealed record DeletePostCommand(int Id) : IRequest<bool>;