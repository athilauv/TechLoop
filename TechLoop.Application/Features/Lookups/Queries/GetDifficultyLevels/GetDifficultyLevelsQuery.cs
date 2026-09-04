using MediatR;
using TechLoop.Application.Features.Lookups.DTOs;

namespace TechLoop.Application.Features.Lookups.Queries.GetDifficultyLevels;

public sealed record GetDifficultyLevelsQuery : IRequest<IEnumerable<LookupOptionResponse>>;
