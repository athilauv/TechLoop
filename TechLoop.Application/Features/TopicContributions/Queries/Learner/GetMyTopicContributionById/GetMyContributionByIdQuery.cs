using MediatR;
using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Queries.Learner.GetMyTopicContributionById;

public sealed record GetMyTopicContributionByIdQuery(int ContributionId) : IRequest<TopicContributionResponse?>;