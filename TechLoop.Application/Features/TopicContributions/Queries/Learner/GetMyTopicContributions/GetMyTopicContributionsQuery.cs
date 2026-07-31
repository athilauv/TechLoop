using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Queries.Learner.GetMyTopicContributions;

public sealed record GetMyTopicContributionsQuery() : IRequest<IEnumerable<TopicContributionSummaryResponse>>;