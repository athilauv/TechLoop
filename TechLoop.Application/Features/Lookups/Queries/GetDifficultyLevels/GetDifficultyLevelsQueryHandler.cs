using MediatR;
using TechLoop.Application.Features.Lookups.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Lookups.Queries.GetDifficultyLevels;

public sealed class GetDifficultyLevelsQueryHandler
    : IRequestHandler<GetDifficultyLevelsQuery, IEnumerable<LookupOptionResponse>>
{
    private readonly ILookupRepository _repository;

    public GetDifficultyLevelsQueryHandler(ILookupRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<LookupOptionResponse>> Handle(
        GetDifficultyLevelsQuery request,
        CancellationToken cancellationToken)
    {
        return _repository.GetDifficultyLevelsAsync(cancellationToken);
    }
}
