using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Queries.GetUsers;

public sealed class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PagedResult<AdminUserResponse>>
{
    private readonly IAdminRepository _repository;
    public GetUsersQueryHandler(IAdminRepository repository) => _repository = repository;

    public Task<PagedResult<AdminUserResponse>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        => _repository.GetUsersAsync(request.Page, request.PageSize, request.Search, request.Status, request.Sort, cancellationToken);
}
