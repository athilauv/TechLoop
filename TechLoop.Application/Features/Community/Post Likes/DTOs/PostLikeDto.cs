namespace TechLoop.Application.Features.Community.PostLikes.DTOs;

public sealed class PostLikeDto
{
    public int PostId { get; set; }
    public Guid UserId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}