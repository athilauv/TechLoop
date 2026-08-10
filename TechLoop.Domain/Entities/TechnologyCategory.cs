namespace TechLoop.Domain.Entities;

public sealed class TechnologyCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? PublishAt { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? DeletedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
}