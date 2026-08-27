using MediatR;
using TechLoop.Application.Features.Admin.DTOs;

namespace TechLoop.Application.Features.Admin.Queries.GetDashboard;

public sealed record GetDashboardQuery : IRequest<AdminDashboardResponse>;
