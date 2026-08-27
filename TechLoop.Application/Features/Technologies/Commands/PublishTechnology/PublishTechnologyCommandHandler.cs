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
        var technology = await _technologyRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        if (technology.PublishedAt is not null)
        {
            throw new ValidationException("Technology is already published.");
        }

        var technologyId = await _technologyRepository.GetTechnologyIdAsync(
            request.Id,
            cancellationToken);

        if (technologyId is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        var mentorTechnologyId = await _technologyRepository.GetMentorTechnologyIdAsync(_currentUserService.UserId, cancellationToken);
        if (mentorTechnologyId is null)
        {
            throw new ValidationException("No technology is assigned to your account.");
        }

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