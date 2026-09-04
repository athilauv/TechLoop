using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Commands.UpdateUserRole;

public sealed class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, bool>
{
    private readonly IAdminRepository _repository;
    public UpdateUserRoleCommandHandler(IAdminRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        if (request.Request.RoleId is < 1 or > 3)
            throw new BadRequestException("RoleId must be 1, 2, or 3.");

        return await _repository.UpdateUserRoleAsync(request.UserId, request.Request.RoleId, cancellationToken);
    }
}
