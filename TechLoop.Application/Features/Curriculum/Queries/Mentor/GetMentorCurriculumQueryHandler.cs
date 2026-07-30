using MediatR;
using TechLoop.Application.Features.Curriculum.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Curriculum.Queries.Mentor;

public sealed class GetMentorCurriculumQueryHandler : IRequestHandler<GetMentorCurriculumQuery, MentorCurriculumResponse?>
{
    private readonly ICurriculumRepository _repository;
    private readonly ICurrentUserService _currentUser;
    public GetMentorCurriculumQueryHandler(ICurriculumRepository repository, ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<MentorCurriculumResponse?> Handle(GetMentorCurriculumQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMentorCurriculumAsync(_currentUser.UserId, cancellationToken);
    }
}