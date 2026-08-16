using MediatR;
using TechLoop.Application.Features.Topics.DTOs;

namespace TechLoop.Application.Features.Topics.Queries.Mentor.GetUnpublishedTopics;

public sealed record GetUnpublishedTopicsQuery(Guid MentorId ) : IRequest<IEnumerable<MentorTopicResponse>>;