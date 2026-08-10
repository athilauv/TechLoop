using FluentValidation;

namespace TechLoop.Application.Features.Community.SavedPosts.Commands.SavePost;

public sealed class SavePostCommandValidator : AbstractValidator<SavePostCommand>
{
    public SavePostCommandValidator()
    {
        RuleFor(x => x.PostId)
            .GreaterThan(0);
    }
}