using FluentValidation;

namespace TechLoop.Application.Features.Submissions.Commands.CreateSubmission;

public sealed class CreateSubmissionCommandValidator : AbstractValidator<CreateSubmissionCommand>
{
    public CreateSubmissionCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.Request.QuestionId)
            .GreaterThan(0);

        RuleFor(x => x.Request.TechnologyId)
            .GreaterThan(0);

        RuleFor(x => x.Request.SourceCode)
            .NotEmpty()
            .MaximumLength(100000);
    }
}