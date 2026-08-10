namespace TechLoop.Domain.Entities;

public sealed class SavedPost
{
    public int PostId { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}