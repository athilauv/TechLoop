using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;

namespace TechLoop.Application.Features.Mentor.Queries.Admin.GetMentorById;

public sealed record GetMentorByIdQuery(int MentorId ) : IRequest<MentorAdminResponse?>;