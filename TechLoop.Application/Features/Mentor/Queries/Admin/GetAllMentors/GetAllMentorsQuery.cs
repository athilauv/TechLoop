using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;

namespace TechLoop.Application.Features.Mentor.Queries.Admin.GetAllMentors;

public sealed record GetAllMentorsQuery() : IRequest<IEnumerable<MentorAdminResponse>>;