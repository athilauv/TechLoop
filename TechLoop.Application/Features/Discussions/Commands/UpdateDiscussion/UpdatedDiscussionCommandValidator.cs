using FluentValidation;

namespace TechLoop.Application.Features.Discussions.Commands.UpdateDiscussion;

public sealed class UpdatedDiscussionCommandValidator : AbstractValidator<UpdatedDiscussionCommand>
{
    public UpdatedDiscussionCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Content)
            .NotEmpty();
    }
}