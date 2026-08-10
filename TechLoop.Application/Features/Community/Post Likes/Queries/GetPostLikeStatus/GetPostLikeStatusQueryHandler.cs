using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Community.PostLikes.Queries.GetPostLikeStatus;

public sealed class GetPostLikeStatusQueryHandler
    : IRequestHandler<GetPostLikeStatusQuery, bool>
{
    private readonly IPostLikeRepository _postLikeRepository;
    private readonly ICurrentUserService _currentUser;

    public GetPostLikeStatusQueryHandler(
        IPostLikeRepository postLikeRepository,
        ICurrentUserService currentUser)
    {
        _postLikeRepository = postLikeRepository;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(
        GetPostLikeStatusQuery request,
        CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            return false;
        }

        return await _postLikeRepository.ExistsAsync(
            request.PostId,
            _currentUser.UserId);
    }
}