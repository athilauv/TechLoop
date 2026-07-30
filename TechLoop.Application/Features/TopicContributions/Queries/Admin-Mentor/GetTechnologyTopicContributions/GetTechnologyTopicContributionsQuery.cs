using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Queries.GetTechnologyTopicContributions;

public sealed record GetTechnologyTopicContributionsQuery(GetTechnologyTopicContributionsRequest Request) : IRequest<IEnumerable<TopicContributionResponse>>;