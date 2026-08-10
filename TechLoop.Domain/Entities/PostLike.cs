namespace TechLoop.Domain.Entities;

public sealed class PostLike
{
    public int PostId { get; set; }

    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; }
}