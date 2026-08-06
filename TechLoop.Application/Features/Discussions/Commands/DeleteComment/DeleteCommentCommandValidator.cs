using FluentValidation;

namespace TechLoop.Application.Features.Discussions.Commands.DeleteComment;

public sealed class DeleteCommentCommandValidator
    : AbstractValidator<DeleteCommentCommand>
{
    public DeleteCommentCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Invalid comment.");
    }
}