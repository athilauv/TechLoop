using MediatR;

namespace TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgressList;

public sealed record GetUserTopicProgressListQuery(Guid UserId) : IRequest<IEnumerable<GetUserTopicProgressListResponse>>;