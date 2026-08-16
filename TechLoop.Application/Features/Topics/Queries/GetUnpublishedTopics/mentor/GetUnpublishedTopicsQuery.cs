using MediatR;
using TechLoop.Application.Features.Topics.DTOs;

namespace TechLoop.Application.Features.Topics.Queries.GetUnpublishedTopics;

public sealed record GetUnpublishedTopicsQuery(Guid MentorId) : IRequest<IEnumerable<MentorTopicResponse>>;