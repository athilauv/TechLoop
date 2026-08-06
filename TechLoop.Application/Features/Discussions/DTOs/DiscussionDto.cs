namespace TechLoop.Application.Features.Discussions.DTOs;

public sealed class DiscussionDto
{
    public int Id { get; set; }

    public Guid UserId { get; set; }

    public int QuestionId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public bool IsPinned { get; set; }

    public bool IsLocked { get; set; }

    public DateTime CreatedAt { get; set; }
}