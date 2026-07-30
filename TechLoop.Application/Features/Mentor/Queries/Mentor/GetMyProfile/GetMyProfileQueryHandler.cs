using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Mentor.Queries.Mentor.GetMyProfile;

public sealed class GetMyProfileQueryHandler : IRequestHandler<GetMyProfileQuery, MentorProfileResponse?>
{
    private readonly IMentorRepository _repository;
    private readonly ICurrentUserService _currentUser;

    public GetMyProfileQueryHandler(IMentorRepository repository, ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<MentorProfileResponse?> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMyProfileAsync(_currentUser.UserId, cancellationToken);
    }
}