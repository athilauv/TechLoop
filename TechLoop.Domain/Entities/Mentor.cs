namespace TechLoop.Domain.Entities;
public sealed class Mentor
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int TechnologyId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Bio { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? ProfileImageUrl { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}