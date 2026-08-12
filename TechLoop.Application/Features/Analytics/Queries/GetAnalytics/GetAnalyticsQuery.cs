using MediatR;
using TechLoop.Application.Features.Analytics.DTOs;

namespace TechLoop.Application.Features.Analytics.Queries.GetAnalytics;

public sealed record GetAnalyticsQuery(
    Guid UserId
) : IRequest<AnalyticsResponse>;