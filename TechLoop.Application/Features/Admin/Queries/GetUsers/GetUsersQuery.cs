using MediatR;
using TechLoop.Application.Features.Admin.DTOs;

namespace TechLoop.Application.Features.Admin.Queries.GetUsers;

public sealed record GetUsersQuery : IRequest<IEnumerable<AdminUserResponse>>;
