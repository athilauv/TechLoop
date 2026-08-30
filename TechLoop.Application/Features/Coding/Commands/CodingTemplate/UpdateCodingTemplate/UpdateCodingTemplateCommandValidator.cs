using FluentValidation;

namespace TechLoop.Application.Features.Coding.Commands.UpdateCodingTemplate;

public sealed class UpdateCodingTemplateCommandValidator : AbstractValidator<UpdateCodingTemplateCommand>
{
    public UpdateCodingTemplateCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Coding template id is required.");

        RuleFor(x => x.TechnologyId)
            .GreaterThan(0)
            .WithMessage("Technology is required.");

        RuleFor(x => x.StarterCode)
            .NotEmpty()
            .WithMessage("Starter code is required.")
            .MaximumLength(50000)
            .WithMessage("Starter code cannot exceed 50000 characters.");

        RuleFor(x => x.SolutionCode)
            .MaximumLength(50000)
            .WithMessage("Solution code cannot exceed 50000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.SolutionCode));
    }
}
