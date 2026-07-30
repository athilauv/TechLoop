namespace TechLoop.Application.Features.Mentor.DTOs;

public sealed class CreateMentorResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? InvitationLink { get; set; }
}