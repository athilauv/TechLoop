using MediatR;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Technologies.Queries.GetAllTechnologies.Mentor;

public sealed class GetAllMentorTechnologiesQueryHandler : IRequestHandler<GetAllMentorTechnologiesQuery, IEnumerable<MentorTechnologyResponse>>
{
    private readonly ITechnologyRepository _repository;
    public GetAllMentorTechnologiesQueryHandler(ITechnologyRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MentorTechnologyResponse>> Handle(GetAllMentorTechnologiesQuery request, CancellationToken cancellationToken)
    {
        var technologies = await _repository.GetAllAsync(cancellationToken);
        return technologies.Select(technology => new MentorTechnologyResponse
        {
            Id = technology.Id,
            CategoryId = technology.CategoryId,
            Name = technology.Name,
            Slug = technology.Slug,
            Description = technology.Description,
            ImageUrl = technology.ImageUrl,
            Position = technology.Position,
            PublishedAt = technology.PublishedAt,
            PublishedBy = technology.PublishedBy,
            CreatedAt = technology.CreatedAt,
            CreatedBy = technology.CreatedBy,
            UpdatedAt = technology.UpdatedAt,
            UpdatedBy = technology.UpdatedBy
        });
    }
}