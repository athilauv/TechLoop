namespace TechLoop.Domain.Entities;

public sealed class CodingTemplate
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public int TechnologyId { get; set; }
    public string StarterCode { get; set; } = string.Empty;
    public string? ExecutionCode { get; set; }
    public string? SolutionCode { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}