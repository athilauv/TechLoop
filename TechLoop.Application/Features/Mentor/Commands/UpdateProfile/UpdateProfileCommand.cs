using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;

namespace TechLoop.Application.Features.Mentor.Commands.UpdateProfile;

public sealed record UpdateProfileCommand(string Email, string Password,string ConfirmPassword, string PhoneNumber, string? Bio, string LinkedInUrl, string GithubUrl, string ProfileImageUrl ) : IRequest<UpdateMentorProfileResponse>;