using FluentValidation;

namespace TechLoop.Application.Features.Discussions.Commands.UpdateComment;

public sealed class UpdateCommentCommandValidator
    : AbstractValidator<UpdateCommentCommand>
{
    public UpdateCommentCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(2000);
    }
}