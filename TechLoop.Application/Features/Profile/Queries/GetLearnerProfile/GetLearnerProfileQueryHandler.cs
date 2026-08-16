using MediatR;
using TechLoop.Application.Features.Learner.Profile.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Learner.Profile.Queries.GetLearnerProfile;

public sealed class GetLearnerProfileQueryHandler : IRequestHandler<GetLearnerProfileQuery, LearnerProfileDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUser;

    public GetLearnerProfileQueryHandler(IUserRepository userRepository, ICurrentUserService currentUser)
    {
        _userRepository = userRepository;
        _currentUser = currentUser;
    }

    public async Task<LearnerProfileDto> Handle( GetLearnerProfileQuery request, CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAuthenticated)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var user = await _userRepository.GetByIdAsync(_currentUser.UserId);
        if (user is null)
        {
            throw new KeyNotFoundException("User profile not found.");
        }

        return new LearnerProfileDto
        {
            Username = user.Username,
            Email = user.Email,
            Role = "Learner"
        };
    }
}