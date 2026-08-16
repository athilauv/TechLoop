namespace TechLoop.Application.Features.Learner.Profile.DTOs;

public sealed class LearnerProfileDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Learner";
}