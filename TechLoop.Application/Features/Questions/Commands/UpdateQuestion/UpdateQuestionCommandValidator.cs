using FluentValidation;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Questions.Commands.UpdateQuestion;

public sealed class UpdateQuestionCommandValidator : AbstractValidator<UpdateQuestionCommand>
{
    public UpdateQuestionCommandValidator()
    {
        RuleFor(x => x.SubTopicId)
            .GreaterThan(0)
            .NotEmpty()
            .WithMessage("SubTopicId cannot be empty");

        RuleFor(x => x.QuestionType)
            .IsInEnum();

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title cannot be empty")
            .MaximumLength(200)
            .WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Slug)
            .NotEmpty()
            .WithMessage("Slug cannot be empty")
            .MaximumLength(200)
            .WithMessage("Slug cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description cannot be empty");

        RuleFor(x => x.Mark)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Mark must be greater than or equal 0");

        // Time limit is required only for coding questions
        RuleFor(x => x.TimeLimitSeconds)
            .GreaterThan(0)
            .WithMessage("Time limit is required for coding questions.")
            .When(x => x.QuestionType == QuestionType.coding);

        // Memory limit is required only for coding questions
        RuleFor(x => x.MemoryLimitMb)
            .GreaterThan(0)
            .WithMessage("Memory limit is required for coding questions.")
            .When(x => x.QuestionType == QuestionType.coding);

        RuleFor(x => x.Position)
            .GreaterThan(0)
            .WithMessage("Position must be greater than or equal to 0")
            .NotEmpty()
            .WithMessage("Position cannot be empty");

        RuleFor(x => x.Difficulty)
            .IsInEnum();
    }
}