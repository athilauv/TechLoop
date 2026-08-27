using MediatR;
using TechLoop.Application.Features.Admin.DTOs;

namespace TechLoop.Application.Features.Admin.Commands.UpdateUserRole;

public sealed record UpdateUserRoleCommand(Guid UserId, AdminUpdateUserRoleRequest Request) : IRequest<bool>;
