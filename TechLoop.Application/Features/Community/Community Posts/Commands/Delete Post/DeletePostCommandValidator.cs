using FluentValidation;

namespace TechLoop.Application.Features.Community.CommunityPosts.Commands.DeletePost;

public sealed class DeletePostCommandValidator : AbstractValidator<DeletePostCommand>
{
    public DeletePostCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}