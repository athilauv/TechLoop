using MediatR;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.UserStatistics.UpdateUserStatistics;

public sealed record UpdateUserStatisticsCommand(Submission Submission ) : IRequest;