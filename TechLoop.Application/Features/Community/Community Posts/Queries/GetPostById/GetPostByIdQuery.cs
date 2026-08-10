using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;

namespace TechLoop.Application.Features.Community.CommunityPosts.Queries.GetPostById;

public sealed record GetPostByIdQuery(int Id) : IRequest<CommunityPostDto>;