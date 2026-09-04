namespace TechLoop.Application.Features.Community.CommunityPosts.DTOs;

public sealed class CommunityPostDto
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int UserRoleId { get; set; }
    public int? TechnologyId { get; set; }
    public string? TechnologyName { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsPinned { get; set; }
    public long LikeCount { get; set; }
    public long CommentCount { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public int TotalItems { get; set; }
}