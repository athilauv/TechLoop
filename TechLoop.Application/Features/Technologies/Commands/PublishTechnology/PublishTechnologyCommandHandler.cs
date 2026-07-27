using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Technologies.Commands.PublishTechnology;

public sealed class PublishTechnologyCommandHandler : IRequestHandler<PublishTechnologyCommand, PublishTechnologyResponse>
{
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUserService;

    public PublishTechnologyCommandHandler(ITechnologyRepository technologyRepository, ICurrentUserService currentUserService)
    {
        _technologyRepository = technologyRepository;
        _currentUserService = currentUserService;
    }

    public async Task<PublishTechnologyResponse> Handle(PublishTechnologyCommand request, CancellationToken cancellationToken)
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
        technology.PublishedBy = _currentUserService.UserId;

        // var rowsAffected = await _technologyRepository.PublishAsync(technology, cancellationToken);
        // if (rowsAffected <= 0)
        // {
        //     throw new Exception("Failed to publish technology.");
        // }

        return new PublishTechnologyResponse
        {
            Success = true,
            Message = "Technology published successfully."
        };
    }
}