using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Application.Interfaces.Infrastructure;

namespace TechLoop.Application.Features.Mentor.Commands.UpdateProfile;

public sealed class UpdateProfileCommandHandler
    : IRequestHandler<UpdateProfileCommand, UpdateMentorProfileResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IMentorRepository _mentorRepository;
    private readonly ICurrentUserService _currentUser;
    private readonly IPasswordHasher _passwordHasher;

    public UpdateProfileCommandHandler(
        IUserRepository userRepository,
        IMentorRepository mentorRepository,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _mentorRepository = mentorRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<UpdateMentorProfileResponse> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user is null)
            throw new Exception("User not found.");

        if (!string.IsNullOrWhiteSpace(user.PasswordHash))
            throw new Exception("Account is already activated.");

        if (request.Password != request.ConfirmPassword)
            throw new Exception("Password and Confirm Password do not match.");

        user.PasswordHash = _passwordHasher.HashPassword(request.Password);
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        await _mentorRepository.UpdateProfileAsync(
            user.Id,
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