using FluentValidation;

namespace TechLoop.Application.Judge0.Commands.SubmitCode;

public sealed class SubmitCodeCommandValidator
    : AbstractValidator<SubmitCodeCommand>
{
    public SubmitCodeCommandValidator()
    {
        RuleFor(x => x.Request)
            .NotNull();

        RuleFor(x => x.Request.SourceCode)
            .NotEmpty()
            .WithMessage("Source code is required.");

        RuleFor(x => x.Request.LanguageId)
            .GreaterThan(0)
            .WithMessage("A valid language is required.");
    }
}