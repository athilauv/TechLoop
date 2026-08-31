using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Mentor.Commands.UpdateProfile;

public sealed class UpdateProfileCommandHandler
    : IRequestHandler<UpdateProfileCommand, UpdateMentorProfileResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IMentorRepository _mentorRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtGenerator _jwtGenerator;

    public UpdateProfileCommandHandler(
        IUserRepository userRepository,
        IMentorRepository mentorRepository,
        IPasswordHasher passwordHasher,
        IJwtGenerator jwtGenerator)
    {
        _userRepository = userRepository;
        _mentorRepository = mentorRepository;
        _passwordHasher = passwordHasher;
        _jwtGenerator = jwtGenerator;
    }

    public async Task<UpdateMentorProfileResponse> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
            throw new BadRequestException("Mentor setup token is required.");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new BadRequestException("Password is required.");

        if (request.Password != request.ConfirmPassword)
            throw new BadRequestException("Password and Confirm Password do not match.");

        if (request.Password.Length < 8 ||
            !request.Password.Any(char.IsUpper) ||
            !request.Password.Any(char.IsLower) ||
            !request.Password.Any(char.IsDigit) ||
            !request.Password.Any(c => !char.IsLetterOrDigit(c)))
        {
            throw new BadRequestException(
                "Password must be at least 8 characters and contain uppercase, lowercase, number and special character.");
        }

        var userId = _jwtGenerator.ValidateMentorSetupToken(request.Token);

        if (!userId.HasValue)
            throw new BadRequestException("Invalid or expired mentor setup link.");

        var user = await _userRepository.GetByIdAsync(userId.Value);

        if (user is null)
            throw new NotFoundException("Mentor account not found.");

        if (user.RoleId != 2)
            throw new ForbiddenException("This setup link is not valid for a mentor account.");

        // Empty password means the account is still waiting for initial activation.
        // Once a password is stored, this same setup token can no longer be reused.
        if (!string.IsNullOrWhiteSpace(user.PasswordHash))
            throw new BadRequestException("Mentor account has already been activated.");

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
            Message = "Mentor account activated successfully."
        };
    }
}
