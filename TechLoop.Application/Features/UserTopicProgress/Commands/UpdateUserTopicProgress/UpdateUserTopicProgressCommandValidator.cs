using FluentValidation;

namespace TechLoop.Application.Features.UserTopicProgress.UpdateUserTopicProgress;

public sealed class UpdateUserTopicProgressCommandValidator : AbstractValidator<UpdateUserTopicProgressCommand>
{
    public UpdateUserTopicProgressCommandValidator()
    {
        RuleFor(x => x.Submission).NotNull();
        RuleFor(x => x.Question).NotNull();
    }
}