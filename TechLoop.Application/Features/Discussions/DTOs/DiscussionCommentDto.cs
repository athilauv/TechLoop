namespace TechLoop.Application.Features.Discussions.DTOs;

public sealed class DiscussionCommentDto
{
    public int Id { get; set; }
    public int DiscussionId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int UserRoleId { get; set; }
    public int? ParentCommentId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int ReplyCount { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}