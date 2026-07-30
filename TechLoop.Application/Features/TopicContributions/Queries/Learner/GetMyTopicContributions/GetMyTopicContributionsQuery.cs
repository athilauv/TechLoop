using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Queries.GetMyTopicContributions;

public sealed record GetMyTopicContributionsQuery(GetMyTopicContributionsRequest Request) : IRequest<IEnumerable<TopicContributionSummaryResponse>>;