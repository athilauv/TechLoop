using MediatR;
using TechLoop.Application.Features.Lookups.DTOs;

namespace TechLoop.Application.Features.Lookups.Queries.GetExampleTypes;

public sealed record GetExampleTypesQuery : IRequest<IEnumerable<LookupOptionResponse>>;
