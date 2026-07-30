using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.Mentor.Commands.CreateMentor;

public sealed class CreateMentorCommandHandler : IRequestHandler<CreateMentorCommand, CreateMentorResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IMentorRepository _mentorRepository;
    private readonly IEmailService _emailService;
    public CreateMentorCommandHandler(IUserRepository userRepository, IMentorRepository mentorRepository, IEmailService emailService)
    {
        _userRepository = userRepository;
        _mentorRepository = mentorRepository;
        _emailService = emailService;
    }

    public async Task<CreateMentorResponse> Handle(CreateMentorCommand request, CancellationToken cancellationToken)
    {
        var existingEmail = await _mentorRepository.EmailExistsAsync(request.Email, cancellationToken);
        if (existingEmail)
        {
            throw new Exception("Email already exists.");
        }

        var technologyExists = await _mentorRepository.TechnologyExistsAsync(request.TechnologyId, cancellationToken);
        if (!technologyExists)
        {
            throw new Exception("Technology not found.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = string.Empty,
            RoleId = 2,
            FailedLoginAttempts = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        var mentorId = await _mentorRepository.CreateAsync(user.Id, request.TechnologyId, DateTimeOffset.UtcNow, cancellationToken);

        var invitationToken = Guid.NewGuid().ToString();
        var invitationLink = $"http://localhost:5264/update-profile?token={invitationToken}";


// await _emailService.SendMentorInvitationAsync(
//     user.Username,
//     user.Email,
//     invitationLink);

        return new CreateMentorResponse
        {
            Success = true,
            Message = "Mentor created successfully.",
            InvitationLink = invitationLink
        };
    }
}