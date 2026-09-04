using MediatR;
using TechLoop.Application.Features.Lookups.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Lookups.Queries.GetQuestionTypes;

public sealed class GetQuestionTypesQueryHandler
    : IRequestHandler<GetQuestionTypesQuery, IEnumerable<LookupOptionResponse>>
{
    private readonly ILookupRepository _repository;

    public GetQuestionTypesQueryHandler(ILookupRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<LookupOptionResponse>> Handle(
        GetQuestionTypesQuery request,
        CancellationToken cancellationToken)
    {
        return _repository.GetQuestionTypesAsync(cancellationToken);
    }
}
