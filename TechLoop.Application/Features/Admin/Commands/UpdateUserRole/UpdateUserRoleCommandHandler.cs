using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Commands.UpdateUserRole;

public sealed class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, bool>
{
    private const int LearnerRoleId = 1;
    private const int MentorRoleId = 2;
    private const int AdminRoleId = 3;

    private readonly IAdminRepository _repository;
    private readonly IUserRepository _userRepository;
    private readonly IJwtGenerator _jwtGenerator;
    private readonly IEmailService _emailService;

    public UpdateUserRoleCommandHandler(
        IAdminRepository repository,
        IUserRepository userRepository,
        IJwtGenerator jwtGenerator,
        IEmailService emailService)
    {
        _repository = repository;
        _userRepository = userRepository;
        _jwtGenerator = jwtGenerator;
        _emailService = emailService;
    }

    public async Task<bool> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        var roleId = request.Request.RoleId;

        if (roleId is < LearnerRoleId or > AdminRoleId)
            throw new BadRequestException("RoleId must be 1, 2, or 3.");

        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user is null)
            throw new NotFoundException("User not found.");

        if (user.RoleId == roleId)
            return true;

        if (roleId == MentorRoleId && (!request.Request.TechnologyId.HasValue || request.Request.TechnologyId.Value <= 0))
            throw new BadRequestException("TechnologyId is required when changing a user to Mentor.");

        var updated = await _repository.UpdateUserRoleAsync(
            request.UserId,
            roleId,
            request.Request.TechnologyId,
            cancellationToken);

        if (!updated)
            return false;

        if (roleId == MentorRoleId)
        {
            user.RoleId = MentorRoleId;
            var invitationToken = _jwtGenerator.GenerateMentorSetupToken(user);
            await _emailService.SendMentorInvitationAsync(
                user.Username,
                user.Email,
                invitationToken);
        }

        return true;
    }
}
