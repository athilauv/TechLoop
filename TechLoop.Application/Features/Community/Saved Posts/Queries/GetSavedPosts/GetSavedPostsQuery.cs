using MediatR;
using TechLoop.Application.Features.Community.SavedPosts.DTOs;

namespace TechLoop.Application.Features.Community.SavedPosts.Queries.GetSavedPosts;

public sealed record GetSavedPostsQuery()
    : IRequest<IEnumerable<SavedPostDto>>;