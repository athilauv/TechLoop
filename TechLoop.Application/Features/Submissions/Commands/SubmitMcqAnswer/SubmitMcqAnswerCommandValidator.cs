using FluentValidation;

namespace TechLoop.Application.Features.Submissions.Commands.SubmitMcqAnswer;

public sealed class SubmitMcqAnswerCommandValidator
    : AbstractValidator<SubmitMcqAnswerCommand>
{
    public SubmitMcqAnswerCommandValidator()
    {
        RuleFor(x => x.Request.QuestionId)
            .GreaterThan(0);

        RuleFor(x => x.Request.TechnologyId)
            .GreaterThan(0);

        RuleFor(x => x.Request.SelectedOptionId)
            .GreaterThan(0);
    }
}