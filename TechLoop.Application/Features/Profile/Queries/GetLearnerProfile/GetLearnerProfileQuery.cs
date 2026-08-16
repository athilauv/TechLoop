using MediatR;
using TechLoop.Application.Features.Learner.Profile.DTOs;

namespace TechLoop.Application.Features.Learner.Profile.Queries.GetLearnerProfile;

public sealed record GetLearnerProfileQuery
    : IRequest<LearnerProfileDto>;