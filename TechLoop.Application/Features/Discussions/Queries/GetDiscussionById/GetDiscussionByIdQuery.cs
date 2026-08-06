using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;

namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussionById;

public sealed record GetDiscussionByIdQuery(int Id ) : IRequest<DiscussionDto>;