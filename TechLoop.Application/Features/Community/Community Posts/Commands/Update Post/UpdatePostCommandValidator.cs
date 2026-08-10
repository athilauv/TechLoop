using FluentValidation;

namespace TechLoop.Application.Features.Community.CommunityPosts.Commands.UpdatePost;

public sealed class UpdatePostCommandValidator : AbstractValidator<UpdatePostCommand>
{
    public UpdatePostCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

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