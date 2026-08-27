using MediatR;
using TechLoop.Application.Features.Admin.DTOs;

namespace TechLoop.Application.Features.Admin.Queries.GetMentorOverview;

public sealed record GetMentorOverviewQuery(int MentorId) : IRequest<AdminMentorOverviewResponse?>;
