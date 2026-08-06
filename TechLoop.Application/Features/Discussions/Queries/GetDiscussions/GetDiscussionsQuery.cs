using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;

namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussions;

public sealed record GetDiscussionsQuery : IRequest<IEnumerable<DiscussionDto>>;