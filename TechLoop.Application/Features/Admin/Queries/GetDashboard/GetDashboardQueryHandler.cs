using MediatR;
using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Queries.GetDashboard;

public sealed class GetDashboardQueryHandler : IRequestHandler<GetDashboardQuery, AdminDashboardResponse>
{
    private readonly IAdminRepository _repository;

    public GetDashboardQueryHandler(IAdminRepository repository)
    {
        _repository = repository;
    }

    public Task<AdminDashboardResponse> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        return _repository.GetDashboardAsync(cancellationToken);
    }
}
