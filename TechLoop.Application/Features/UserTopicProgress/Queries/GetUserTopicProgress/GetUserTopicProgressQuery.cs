using MediatR;

namespace TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgress;

public sealed record GetUserTopicProgressQuery(Guid UserId, int TopicId) : IRequest<GetUserTopicProgressResponse>;