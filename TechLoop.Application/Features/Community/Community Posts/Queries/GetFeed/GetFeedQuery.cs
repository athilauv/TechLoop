using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;

namespace TechLoop.Application.Features.Community.CommunityPosts.Queries.GetFeed;

public sealed record GetFeedQuery(int Page=1, int PageSize=20, int? TechnologyId=null, string? Search=null, string? Sort="newest") : IRequest<PagedResult<CommunityPostDto>>;
