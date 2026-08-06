using FluentValidation;

namespace TechLoop.Application.Features.DiscussionComments.Commands.CreateComment;

public sealed class CreateCommentCommandValidator
    : AbstractValidator<CreateCommentCommand>
{
    public CreateCommentCommandValidator()
    {
        RuleFor(x => x.DiscussionId)
            .GreaterThan(0);

        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(2000);
    }
}