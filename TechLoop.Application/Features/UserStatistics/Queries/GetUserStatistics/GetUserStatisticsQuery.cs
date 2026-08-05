using MediatR;

namespace TechLoop.Application.Features.UserStatistics.Queries.GetUserStatistics;

public sealed record GetUserStatisticsQuery(Guid UserId) : IRequest<GetUserStatisticsResponse>;