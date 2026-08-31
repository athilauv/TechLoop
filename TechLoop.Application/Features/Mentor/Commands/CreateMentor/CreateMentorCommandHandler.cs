using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Mentor.Commands.CreateMentor;

public sealed class CreateMentorCommandHandler
    : IRequestHandler<CreateMentorCommand, CreateMentorResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IMentorRepository _mentorRepository;
    private readonly IEmailService _emailService;
    private readonly IJwtGenerator _jwtGenerator;

    public CreateMentorCommandHandler(
        IUserRepository userRepository,
        IMentorRepository mentorRepository,
        IEmailService emailService,
        IJwtGenerator jwtGenerator)
    {
        _userRepository = userRepository;
        _mentorRepository = mentorRepository;
        _emailService = emailService;
        _jwtGenerator = jwtGenerator;
    }

    public async Task<CreateMentorResponse> Handle(
        CreateMentorCommand request,
        CancellationToken cancellationToken)
    {
        // Check whether email already exists.
        var existingEmail = await _mentorRepository.EmailExistsAsync(
            request.Email,
            cancellationToken);

        if (existingEmail)
            throw new ConflictException("Email already exists.");

        // Check whether technology exists.
        var technologyExists = await _mentorRepository.TechnologyExistsAsync(
            request.TechnologyId,
            cancellationToken);

        if (!technologyExists)
            throw new NotFoundException("Technology not found.");

        // Check whether a user already exists with this email.
        var existingUser = await _userRepository.GetByEmailAsync(
            request.Email);

        if (existingUser is not null)
            throw new ConflictException("Email already exists.");

        // Check whether username already exists.
        var existingUsername = await _userRepository.GetByUsernameAsync(
            request.Username);

        if (existingUsername is not null)
            throw new ConflictException("Username already exists.");

        // Create user.
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = string.Empty,
            RoleId = 2,
            FailedLoginAttempts = 0,
            LockedUntil = null,
            LastLoginAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        // Create mentor.
        await _mentorRepository.CreateAsync(
            user.Id,
            request.TechnologyId,
            DateTimeOffset.UtcNow,
            cancellationToken);

        // Generate setup token.
        var invitationToken =
            _jwtGenerator.GenerateMentorSetupToken(user);

        // EmailService will build the frontend invitation URL
        // from the configured FrontendBaseUrl.
        await _emailService.SendMentorInvitationAsync(
            user.Username,
            user.Email,
            invitationToken);

        return new CreateMentorResponse
        {
            Success = true,
            Message =
                "Mentor created successfully and the initial setup email was sent.",
            InvitationLink = null
        };
    }
}