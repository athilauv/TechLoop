using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Coding.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Coding.Commands.UpdateCodingTemplate;

public sealed class UpdateCodingTemplateCommandHandler : IRequestHandler<UpdateCodingTemplateCommand, UpdateCodingTemplateResponse>
{
    private readonly ICodingTemplateRepository _repository;
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUser;

    public UpdateCodingTemplateCommandHandler(ICodingTemplateRepository repository, ITechnologyRepository technologyRepository, ICurrentUserService currentUser)
    {
        _repository = repository;
        _technologyRepository = technologyRepository;
        _currentUser = currentUser;
    }

    public async Task<UpdateCodingTemplateResponse> Handle(UpdateCodingTemplateCommand request, CancellationToken cancellationToken)
    {
        var template = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (template is null)
            throw new NotFoundException("Coding template not found.");

        var technology = await _technologyRepository.GetByIdAsync(request.TechnologyId, cancellationToken);
        if (technology is null)
            throw new NotFoundException("Technology not found.");

        if (template.TechnologyId != request.TechnologyId)
        {
            var exists = await _repository.ExistsAsync(template.QuestionId, request.TechnologyId, cancellationToken);
            if (exists)
                throw new ValidationException("Coding template already exists for this technology.");
        }

        template.TechnologyId = request.TechnologyId;
        template.StarterCode = request.StarterCode.Trim();
        template.ExecutionCode = request.ExecutionCode?.Trim();
        template.SolutionCode = request.SolutionCode?.Trim();
        template.UpdatedBy = _currentUser.UserId;
        template.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(template, cancellationToken);
        return new UpdateCodingTemplateResponse
        {
            Success = true,
            Message = "Coding template updated successfully."
        };
    }
}
