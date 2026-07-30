using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;

namespace TechLoop.Application.Features.Mentor.Queries.Mentor.GetMyProfile;

public sealed record GetMyProfileQuery() : IRequest<MentorProfileResponse?>;