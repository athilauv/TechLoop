using FluentValidation;

namespace TechLoop.Application.Features.Community.PostComments.Commands.UpdateComment;

public sealed class UpdateCommentValidator : AbstractValidator<UpdateCommentCommand>
{
    public UpdateCommentValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(1000);
    }
}