using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;

namespace TechLoop.Application.Features.SubTopics.Queries.Mentor.GetUnpublishedSubTopics;

public sealed record GetUnpublishedSubTopicsQuery(Guid MentorId)
    : IRequest<IEnumerable<MentorSubTopicResponse>>;