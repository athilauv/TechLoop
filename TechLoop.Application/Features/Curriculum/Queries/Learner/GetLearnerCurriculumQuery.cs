using MediatR;
using TechLoop.Application.Features.Curriculum.DTOs;

namespace TechLoop.Application.Features.Curriculum.Queries;

public sealed record GetLearnerCurriculumQuery(int TechnologyId ) : IRequest<LearnerCurriculumResponse?>;