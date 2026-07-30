namespace TechLoop.Application.Features.Mentor.DTOs;

public sealed class UpdateMentorProfileRequest
{
   // public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string LinkedInUrl { get; set; } = string.Empty;
    public string GithubUrl { get; set; } = string.Empty;
    public string ProfileImageUrl { get; set; } = string.Empty;
}