using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;

namespace TechLoop.Application.Features.Community.CommunityPosts.Commands.CreatePost;

public sealed class CreatePostCommand : IRequest<CommunityPostDto>
{
    public int? TechnologyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}