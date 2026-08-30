using FluentValidation;

namespace TechLoop.Application.Judge0.Commands.RunCode;

public sealed class RunCodeCommandValidator : AbstractValidator<RunCodeCommand>
{
    public RunCodeCommandValidator()
    {
        RuleFor(x => x.Request)
            .NotNull();

        RuleFor(x => x.Request.QuestionId)
            .GreaterThan(0)
            .WithMessage("A valid question is required.");

        RuleFor(x => x.Request.SourceCode)
            .NotEmpty()
            .WithMessage("Source code is required.");
    }
}
