using FluentValidation;

namespace TechLoop.Application.Features.Community.PostComments.Commands.DeleteComment;

public sealed class DeleteCommentValidator : AbstractValidator<DeleteCommentCommand>
{
    public DeleteCommentValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}