using MediatR;
using TechLoop.Application.Common;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Commands.CreateTopicContribution;

public sealed record CreateTopicContributionCommand(Guid LearnerId, CreateTopicContributionRequest Request) : IRequest<int>;