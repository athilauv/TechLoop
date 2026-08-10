using MediatR;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Technologies.Queries.GetAllTechnologies.Learner;

public sealed class
    GetAllLearnerTechnologiesQueryHandler : IRequestHandler<GetAllLearnerTechnologiesQuery,
    IEnumerable<LearnerTechnologyResponse>>
{
    private readonly ITechnologyRepository _repository;

    public GetAllLearnerTechnologiesQueryHandler(ITechnologyRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<LearnerTechnologyResponse>> Handle(
        GetAllLearnerTechnologiesQuery request,
        CancellationToken cancellationToken)
    {
        var technologies = await _repository.GetPublishedAsync(cancellationToken);
        return technologies.Select(technology => new LearnerTechnologyResponse
        {
            Id = technology.Id,
            CategoryId = technology.CategoryId,
            Name = technology.Name,
            Slug = technology.Slug,
            Description = technology.Description,
            ImageUrl = technology.ImageUrl,
            Position = technology.Position,
            CreatedAt = technology.CreatedAt,
            UpdatedAt = technology.UpdatedAt
        });
    }
}