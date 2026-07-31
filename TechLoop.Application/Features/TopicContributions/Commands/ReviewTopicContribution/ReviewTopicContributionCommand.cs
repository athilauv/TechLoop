using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Commands.ReviewTopicContribution;

public sealed record ReviewTopicContributionCommand(Guid ReviewerId, ReviewTopicContributionRequest Request) : IRequest<bool>;