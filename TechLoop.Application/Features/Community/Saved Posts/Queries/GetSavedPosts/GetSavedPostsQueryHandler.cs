using MediatR;
using TechLoop.Application.Features.Community.SavedPosts.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Community.SavedPosts.Queries.GetSavedPosts;

public sealed class GetSavedPostsQueryHandler
    : IRequestHandler<GetSavedPostsQuery, IEnumerable<SavedPostDto>>
{
    private readonly ISavedPostRepository _savedPostRepository;
    private readonly ICurrentUserService _currentUser;

    public GetSavedPostsQueryHandler(
        ISavedPostRepository savedPostRepository,
        ICurrentUserService currentUser)
    {
        _savedPostRepository = savedPostRepository;
        _currentUser = currentUser;
    }

    public async Task<IEnumerable<SavedPostDto>> Handle(
        GetSavedPostsQuery request,
        CancellationToken cancellationToken)
    {
        if (_currentUser.UserId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        return await _savedPostRepository.GetSavedPostsAsync(_currentUser.UserId);
    }
}