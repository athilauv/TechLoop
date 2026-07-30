using MediatR;
using TechLoop.Application.Features.Curriculum.DTOs;

namespace TechLoop.Application.Features.Curriculum.Queries.Mentor;

public sealed record GetMentorCurriculumQuery() : IRequest<MentorCurriculumResponse?>;