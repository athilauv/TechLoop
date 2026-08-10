using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;

namespace TechLoop.Application.Features.Community.CommunityPosts.Queries.GetFeed;

public sealed record GetFeedQuery() : IRequest<IEnumerable<CommunityPostDto>>;