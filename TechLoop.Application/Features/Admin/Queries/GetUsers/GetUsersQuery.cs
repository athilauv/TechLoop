using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Admin.DTOs;

namespace TechLoop.Application.Features.Admin.Queries.GetUsers;

public sealed record GetUsersQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    string? Status = null,
    string? Sort = "created-desc") : IRequest<PagedResult<AdminUserResponse>>;
