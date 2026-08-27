using MediatR;
using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Queries.GetUsers;

public sealed class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, IEnumerable<AdminUserResponse>>
{
    private readonly IAdminRepository _repository;

    public GetUsersQueryHandler(IAdminRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<AdminUserResponse>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        return _repository.GetUsersAsync(cancellationToken);
    }
}
