using FluentValidation;

namespace TechLoop.Application.Features.Discussions.Commands.UnpinDiscussion;

public sealed class UnpinDiscussionCommandValidator : AbstractValidator<UnpinDiscussionCommand>
{
    public UnpinDiscussionCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Discussion id must be greater than 0.");
    }
}