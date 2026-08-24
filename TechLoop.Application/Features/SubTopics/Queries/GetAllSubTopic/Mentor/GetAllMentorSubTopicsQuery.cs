using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;

namespace TechLoop.Application.Features.SubTopics.Queries.GetAllSubTopics.Mentor;

public sealed record GetAllMentorSubTopicsQuery(int? TopicId)
    : IRequest<IEnumerable<MentorSubTopicResponse>>;