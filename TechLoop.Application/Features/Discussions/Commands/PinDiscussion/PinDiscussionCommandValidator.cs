using FluentValidation;

namespace TechLoop.Application.Features.Discussions.Commands.PinDiscussion;

public sealed class PinDiscussionCommandValidator : AbstractValidator<PinDiscussionCommand>
{
    public PinDiscussionCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}