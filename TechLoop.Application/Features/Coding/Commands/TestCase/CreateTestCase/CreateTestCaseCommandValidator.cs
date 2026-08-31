using FluentValidation;

namespace TechLoop.Application.Features.Coding.Commands.CreateTestCase;

public sealed class CreateTestCaseCommandValidator
    : AbstractValidator<CreateTestCaseCommand>
{
    public CreateTestCaseCommandValidator()
    {
        RuleFor(x => x.QuestionId)
            .GreaterThan(0)
            .WithMessage("Question is required.");

        // Empty input is valid for programs that do not read stdin.
        RuleFor(x => x.Input)
            .NotNull()
            .WithMessage("Input is required.");

        RuleFor(x => x.ExpectedOutput)
            .NotNull()
            .WithMessage("Expected output is required.");

        RuleFor(x => x.Position)
            .GreaterThan(0)
            .WithMessage("Position must be greater than zero.");
    }
}
