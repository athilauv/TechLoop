using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Mentor.Commands.UpdateMentorProfile;

public sealed class UpdateMentorProfileCommandHandler
    : IRequestHandler<UpdateMentorProfileCommand, UpdateMentorProfileResponse>
{
    private readonly IMentorRepository _mentorRepository;
    private readonly ICurrentUserService _currentUser;

    public UpdateMentorProfileCommandHandler(
        IMentorRepository mentorRepository,
        ICurrentUserService currentUser)
    {
        _mentorRepository = mentorRepository;
        _currentUser = currentUser;
    }

    public async Task<UpdateMentorProfileResponse> Handle(
        UpdateMentorProfileCommand request,
        CancellationToken cancellationToken)
    {
        await _mentorRepository.UpdateProfileAsync(
            _currentUser.UserId,
            request.PhoneNumber,
            request.Bio,
            request.LinkedInUrl,
            request.GithubUrl,
            request.ProfileImageUrl,
            DateTimeOffset.UtcNow,
            cancellationToken);

        return new UpdateMentorProfileResponse
        {
            Success = true,
            Message = "Profile updated successfully."
        };
    }
}