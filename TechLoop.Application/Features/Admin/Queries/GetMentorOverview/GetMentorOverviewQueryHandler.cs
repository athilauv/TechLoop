using MediatR;
using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Queries.GetMentorOverview;

public sealed class GetMentorOverviewQueryHandler : IRequestHandler<GetMentorOverviewQuery, AdminMentorOverviewResponse?>
{
    private readonly IAdminRepository _repository;

    public GetMentorOverviewQueryHandler(IAdminRepository repository)
    {
        _repository = repository;
    }

    public Task<AdminMentorOverviewResponse?> Handle(GetMentorOverviewQuery request, CancellationToken cancellationToken)
    {
        return _repository.GetMentorOverviewAsync(request.MentorId, cancellationToken);
    }
}
