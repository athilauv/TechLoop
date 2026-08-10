namespace TechLoop.Application.Features.Community.PostComments.DTOs;

public sealed class PostCommentDto
{
    public int Id { get; set; }

    public int PostId { get; set; }

    public Guid UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public int? ParentCommentId { get; set; }

    public string Content { get; set; } = string.Empty;

    public long ReplyCount { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
}