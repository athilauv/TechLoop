using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;

namespace TechLoop.Application.Features.Mentor.Commands.UpdateMentorProfile;

public sealed record UpdateMentorProfileCommand(
    string? PhoneNumber,
    string? Bio,
    string? LinkedInUrl,
    string? GithubUrl,
    string? ProfileImageUrl
) : IRequest<UpdateMentorProfileResponse>;