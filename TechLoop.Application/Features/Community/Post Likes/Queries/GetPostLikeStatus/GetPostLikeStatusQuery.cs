using MediatR;

namespace TechLoop.Application.Features.Community.PostLikes.Queries.GetPostLikeStatus;

public sealed record GetPostLikeStatusQuery(int PostId) : IRequest<bool>;