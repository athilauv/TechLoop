using FluentValidation;

namespace TechLoop.Application.Features.Community.PostLikes.Commands.UnlikePost;

public sealed class UnlikePostCommandValidator : AbstractValidator<UnlikePostCommand>
{
    public UnlikePostCommandValidator()
    {
        RuleFor(x => x.PostId)
            .GreaterThan(0);
    }
}