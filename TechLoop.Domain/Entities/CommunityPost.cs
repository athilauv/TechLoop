namespace TechLoop.Domain.Entities;

public sealed class CommunityPost
{
    public int Id { get; set; }

    public Guid UserId { get; set; }

    public int? TechnologyId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public bool IsPinned { get; set; }

    public Guid CreatedBy { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}