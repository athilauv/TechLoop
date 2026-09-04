using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
namespace TechLoop.Application.Features.Admin.Queries.GetCommunity;
public sealed record GetCommunityQuery(int Page=1, int PageSize=20, int? TechnologyId=null, string? Search=null, string? Sort="newest") : IRequest<PagedResult<CommunityPostDto>>;
