using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Technologies.Commands.PublishAdminTechnology;

public sealed class PublishAdminTechnologyCommandHandler : IRequestHandler<PublishAdminTechnologyCommand, PublishTechnologyResponse>
{
    private readonly ITechnologyRepository _technologyRepository;

    public PublishAdminTechnologyCommandHandler(ITechnologyRepository technologyRepository)
    {
        _technologyRepository = technologyRepository;
    }

    public async Task<PublishTechnologyResponse> Handle(PublishAdminTechnologyCommand request, CancellationToken cancellationToken)
    {
        var technology = await _technologyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        if (technology.PublishedAt is not null)
        {
            throw new ValidationException("Technology is already published.");
        }

        technology.PublishedAt = DateTime.UtcNow;
        technology.PublishedBy = request.PublishedBy;

        await _technologyRepository.PublishAsync(technology, cancellationToken);

        return new PublishTechnologyResponse
        {
            Success = true,
            Message = "Technology published successfully."
        };
    }
}
