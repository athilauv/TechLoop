using FluentValidation;

namespace TechLoop.Application.Features.Community.PostComments.Commands.UpdateComment;

public sealed class UpdateCommentValidator : AbstractValidator<UpdateCommentCommand>
{
    public UpdateCommentValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(10000);
    }
}