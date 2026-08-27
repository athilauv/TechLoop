using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;

namespace TechLoop.Application.Features.Admin.Queries.GetCommunity;

public sealed record GetCommunityQuery : IRequest<IEnumerable<CommunityPostDto>>;
