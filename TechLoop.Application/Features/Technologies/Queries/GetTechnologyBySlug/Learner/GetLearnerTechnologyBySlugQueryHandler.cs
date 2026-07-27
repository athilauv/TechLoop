using MediatR;
using TechLoop.Application.Features.Technologies.DTOs;

namespace TechLoop.Application.Features.Technologies.Queries.GetTechnologyById.Learner;

public sealed record GetLearnerTechnologyBySlugQuery(int Id ) : IRequest<LearnerTechnologyResponse>;