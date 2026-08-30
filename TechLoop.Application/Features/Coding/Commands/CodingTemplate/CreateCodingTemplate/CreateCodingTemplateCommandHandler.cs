using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Coding.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Coding.Commands.CreateCodingTemplate;

public sealed class CreateCodingTemplateCommandHandler : IRequestHandler<CreateCodingTemplateCommand, CreateCodingTemplateResponse>
{
    private readonly ICodingTemplateRepository _codingTemplateRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly ITechnologyRepository _technologyRepository;
    private readonly ICurrentUserService _currentUser;

    public CreateCodingTemplateCommandHandler(ICodingTemplateRepository codingTemplateRepository, IQuestionRepository questionRepository, ITechnologyRepository technologyRepository, ICurrentUserService currentUser)
    {
        _codingTemplateRepository = codingTemplateRepository;
        _questionRepository = questionRepository;
        _technologyRepository = technologyRepository;
        _currentUser = currentUser;
    }

    public async Task<CreateCodingTemplateResponse> Handle(CreateCodingTemplateCommand request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.QuestionId, cancellationToken);
        if (question is null)
            throw new NotFoundException("Question not found.");

        if (question.QuestionType != QuestionType.coding)
            throw new ValidationException(
                "Coding templates can only be added to coding questions.");

        var technology = await _technologyRepository.GetByIdAsync(request.TechnologyId, cancellationToken);
        if (technology is null)
            throw new NotFoundException("Technology not found.");

        var exists = await _codingTemplateRepository.ExistsAsync(request.QuestionId, request.TechnologyId, cancellationToken);
        if (exists)
            throw new ValidationException("Coding template already exists for this technology.");

        var template = new CodingTemplate
        {
            QuestionId = request.QuestionId,
            TechnologyId = request.TechnologyId,
            StarterCode = request.StarterCode.Trim(),
            ExecutionCode = request.ExecutionCode?.Trim(),
            SolutionCode = request.SolutionCode?.Trim(),
            CreatedAt = DateTime.UtcNow,
            CreatedBy = _currentUser.UserId
        };

        await _codingTemplateRepository.CreateAsync(template, cancellationToken);
        return new CreateCodingTemplateResponse
        {
            Success = true,
            Message = "Coding template created successfully."
        };
    }
}
