namespace TechLoop.Application.Features.Community.SavedPosts.DTOs;

public sealed class SavedPostDto
{
    public int PostId { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}