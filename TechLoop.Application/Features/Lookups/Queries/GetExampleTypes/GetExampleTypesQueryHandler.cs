using MediatR;
using TechLoop.Application.Features.Lookups.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Lookups.Queries.GetExampleTypes;

public sealed class GetExampleTypesQueryHandler
    : IRequestHandler<GetExampleTypesQuery, IEnumerable<LookupOptionResponse>>
{
    private readonly ILookupRepository _repository;

    public GetExampleTypesQueryHandler(ILookupRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<LookupOptionResponse>> Handle(
        GetExampleTypesQuery request,
        CancellationToken cancellationToken)
    {
        return _repository.GetExampleTypesAsync(cancellationToken);
    }
}
