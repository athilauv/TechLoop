using FluentValidation;

namespace TechLoop.Application.Features.Community.SavedPosts.Commands.UnsavePost;

public sealed class UnsavePostCommandValidator : AbstractValidator<UnsavePostCommand>
{
    public UnsavePostCommandValidator()
    {
        RuleFor(x => x.PostId)
            .GreaterThan(0);
    }
}