namespace TechLoop.Application.Features.Community.PostComments.DTOs;

public sealed class CreateCommentRequest
{
    public int? ParentCommentId { get; set; }
    public string Content { get; set; } = string.Empty;
}