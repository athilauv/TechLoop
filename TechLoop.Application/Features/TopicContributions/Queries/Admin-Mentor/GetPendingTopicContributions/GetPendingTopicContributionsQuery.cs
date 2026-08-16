using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Queries.GetPendingTopicContributions;

public sealed record GetPendingTopicContributionsQuery(Guid MentorId)
    : IRequest<IEnumerable<TopicContributionPendingResponse>>;