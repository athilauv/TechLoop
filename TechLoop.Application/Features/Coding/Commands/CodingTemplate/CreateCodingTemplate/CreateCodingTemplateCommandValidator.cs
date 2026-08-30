using FluentValidation;

namespace TechLoop.Application.Features.Coding.Commands.CreateCodingTemplate;

public sealed class CreateCodingTemplateCommandValidator : AbstractValidator<CreateCodingTemplateCommand>
{
    public CreateCodingTemplateCommandValidator()
    {
        RuleFor(x => x.QuestionId)
            .GreaterThan(0)
            .WithMessage("Question is required.");

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
