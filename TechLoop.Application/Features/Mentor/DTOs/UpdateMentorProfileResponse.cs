namespace TechLoop.Application.Features.Mentor.DTOs;

public sealed class UpdateMentorProfileResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}