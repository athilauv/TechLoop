using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;

namespace TechLoop.Application.Features.TopicContributions.Queries.Mentor.GetMentorTopicContributionById;

public sealed record GetMentorTopicContributionByIdQuery(Guid MentorId, int ContributionId ) : IRequest<TopicContributionResponse?>;