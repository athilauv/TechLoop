using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Technologies.Commands.PublishTechnology;

public sealed class PublishTechnologyCommandHandler
    : IRequestHandler<PublishTechnologyCommand, PublishTechnologyResponse>
{
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUserService;

    public PublishTechnologyCommandHandler(
        ITechnologyRepository technologyRepository,
        ICurrentUserService currentUserService)
    {
        _technologyRepository = technologyRepository;
        _currentUserService = currentUserService;
    }

    public async Task<PublishTechnologyResponse> Handle(
        PublishTechnologyCommand request,
        CancellationToken cancellationToken)
    {
        // Check whether the technology exists.
        var technology = await _technologyRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        // Check whether it is already published.
        if (technology.PublishedAt is not null)
        {
            throw new ValidationException("Technology is already published.");
        }

        // Get the technology id.
        var technologyId = await _technologyRepository.GetTechnologyIdAsync(
            request.Id,
            cancellationToken);

        if (technologyId is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        // Get the logged-in mentor's technology.
        var mentorTechnologyId = await _technologyRepository.GetMentorTechnologyIdAsync(_currentUserService.UserId, cancellationToken);
        if (mentorTechnologyId is null)
        {
            throw new ValidationException("No technology is assigned to your account.");
        }

        // Allow publishing only for the mentor's own technology.
        if (technologyId != mentorTechnologyId)
        {
            throw new ValidationException("You can publish only your own technology.");
        }

        technology.PublishedAt = DateTime.UtcNow;
        technology.PublishedBy = _currentUserService.UserId;

        await _technologyRepository.PublishAsync(technology, cancellationToken);
        return new PublishTechnologyResponse
        {
            Success = true,
            Message = "Technology published successfully."
        };
    }
}