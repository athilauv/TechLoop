namespace TechLoop.Application.Features.Mentor.DTOs;

public sealed class MentorProfileResponse
{
   // public int Id { get; set; }

  //  public Guid UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public int TechnologyId { get; set; }

    public string TechnologyName { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string? Bio { get; set; }

    public string? LinkedInUrl { get; set; }

    public string? GithubUrl { get; set; }

    public string? ProfileImageUrl { get; set; }

    //public DateTime CreatedAt { get; set; }

    //public DateTime? UpdatedAt { get; set; }
}