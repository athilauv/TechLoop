using FluentValidation;

namespace TechLoop.Application.Features.Discussions.Commands.DeleteDiscussion;

public sealed class DeleteDiscussionCommandValidator
    : AbstractValidator<DeleteDiscussionCommand>
{
    public DeleteDiscussionCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Invalid discussion id.");
    }
}