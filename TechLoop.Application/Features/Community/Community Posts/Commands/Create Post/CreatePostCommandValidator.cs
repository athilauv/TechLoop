using FluentValidation;

namespace TechLoop.Application.Features.Community.CommunityPosts.Commands.CreatePost;

public sealed class CreatePostCommandValidator : AbstractValidator<CreatePostCommand>
{
    public CreatePostCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Content)
            .NotEmpty();

        RuleFor(x => x.TechnologyId)
            .GreaterThan(0)
            .When(x => x.TechnologyId.HasValue);
    }
}