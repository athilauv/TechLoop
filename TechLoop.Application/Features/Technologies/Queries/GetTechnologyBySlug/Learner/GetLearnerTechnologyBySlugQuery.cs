using MediatR;
using TechLoop.Application.Features.Technologies.DTOs;

namespace TechLoop.Application.Features.Technologies.Queries.GetTechnologyBySlug.Learner;

public sealed record GetLearnerTechnologyBySlugQuery(string Slug) : IRequest<LearnerTechnologyResponse>;