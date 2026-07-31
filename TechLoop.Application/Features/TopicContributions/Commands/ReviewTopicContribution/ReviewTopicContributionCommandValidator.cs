using FluentValidation;

namespace TechLoop.Application.Features.TopicContributions.Commands.ReviewTopicContribution;

public sealed class ReviewTopicContributionCommandValidator : AbstractValidator<ReviewTopicContributionCommand>
{
    public ReviewTopicContributionCommandValidator()
    {
        RuleFor(x => x.Request.Id)
            .GreaterThan(0)
            .WithMessage("Invalid contribution.");

        RuleFor(x => x.Request.Status)
            .InclusiveBetween((short)1, (short)4)
            .WithMessage("Invalid contribution status.");

        RuleFor(x => x.Request.ReviewNotes)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.Request.ReviewNotes));
    }
}