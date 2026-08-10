using FluentValidation;

namespace TechLoop.Application.Features.Community.PostLikes.Commands.LikePost;

public sealed class LikePostCommandValidator : AbstractValidator<LikePostCommand>
{
    public LikePostCommandValidator()
    {
        RuleFor(x => x.PostId)
            .GreaterThan(0);
    }
}