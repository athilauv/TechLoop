using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.Admin.Queries.GetPendingContributions;

public sealed record GetPendingContributionsQuery : IRequest<IEnumerable<TopicContributionPendingResponse>>;
