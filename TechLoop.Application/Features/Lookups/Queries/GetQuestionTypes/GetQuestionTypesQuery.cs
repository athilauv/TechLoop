using MediatR;
using TechLoop.Application.Features.Lookups.DTOs;

namespace TechLoop.Application.Features.Lookups.Queries.GetQuestionTypes;

public sealed record GetQuestionTypesQuery : IRequest<IEnumerable<LookupOptionResponse>>;
