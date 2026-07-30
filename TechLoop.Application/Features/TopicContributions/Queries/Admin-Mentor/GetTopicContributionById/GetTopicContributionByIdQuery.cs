using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Queries.GetTopicContributionById;

public sealed record GetTopicContributionByIdQuery(GetTopicContributionByIdRequest Request) : IRequest<TopicContributionResponse?>;