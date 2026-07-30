using MediatR;
using TechLoop.Application.Features.Curriculum.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Curriculum.Queries;

public sealed class GetLearnerCurriculumQueryHandler : IRequestHandler<GetLearnerCurriculumQuery, LearnerCurriculumResponse?>
{
    private readonly ICurriculumRepository _curriculumRepository;

    public GetLearnerCurriculumQueryHandler(ICurriculumRepository curriculumRepository)
    {
        _curriculumRepository = curriculumRepository;
    }

    public async Task<LearnerCurriculumResponse?> Handle(GetLearnerCurriculumQuery request, CancellationToken cancellationToken)
    {
        return await _curriculumRepository.GetLearnerCurriculumAsync(request.TechnologyId, cancellationToken);
    }
}