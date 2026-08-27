using TechLoop.Domain;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Application.Features.Technologies.DTOs;
using MediatR;
using TechLoop.Application.Common.Exceptions;

namespace TechLoop.Application.Features.Technologies.Commands.DeleteTechnology;

public sealed class DeleteTechnologyCommandHandler : IRequestHandler<DeleteTechnologyCommand, DeleteTechnologyResponse>
{
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteTechnologyCommandHandler(ITechnologyRepository technologyRepository, ICurrentUserService currentUserService)
    {
        _technologyRepository = technologyRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DeleteTechnologyResponse> Handle(DeleteTechnologyCommand request, CancellationToken cancellationToken)
    {
        var technology = await _technologyRepository.GetByIdAsync(request.Id, cancellationToken);
        if (technology is null)
        {
            throw new NotFoundException("Technology not found.");
        }

        await _technologyRepository.SoftDeleteAsync(request.Id, _currentUserService.UserId, cancellationToken);

        return new DeleteTechnologyResponse
        {
            Success = true,
            Message = "Technology deleted successfully."
        };
    }
}

