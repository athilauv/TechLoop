using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Discussions.DTOs;
namespace TechLoop.Application.Features.Discussions.Queries.GetDiscussions;
public sealed record GetDiscussionsQuery(int Page=1, int PageSize=20, string? Search=null, string? Sort="newest") : IRequest<PagedResult<DiscussionDto>>;
