using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Technologies.Queries.GetTechnologyById.Learner;

public sealed class GetLearnerTechnologyByIdQueryHandler : IRequestHandler<GetLearnerTechnologyBySlugQueryHandler, LearnerTechnologyResponse>
{
    private readonly ITechnologyRepository _repository;
    public GetLearnerTechnologyByIdQueryHandler(ITechnologyRepository repository)
    {
        _repository = repository;
    }

    public async Task<LearnerTechnologyResponse> Handle(GetLearnerTechnologyBySlugQueryHandler request, CancellationToken cancellationToken)
    {
        var technology = await _repository.GetPublishedBySlugAsync(request.Slug, cancellationToken);
        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        return new LearnerTechnologyResponse
        {
            Id = technology.Id,
            Name = technology.Name,
            Slug = technology.Slug,
            Description = technology.Description,
            ImageUrl = technology.ImageUrl,
            Position = technology.Position,
            CreatedAt = technology.CreatedAt,
            UpdatedAt = technology.UpdatedAt,
        };
    }
}