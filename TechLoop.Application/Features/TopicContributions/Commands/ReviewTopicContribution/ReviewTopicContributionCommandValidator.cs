using FluentValidation;

namespace TechLoop.Application.Features.TopicContributions.Commands.ReviewTopicContribution;

public sealed class ReviewTopicContributionCommandValidator : AbstractValidator<ReviewTopicContributionCommand>
{
    public ReviewTopicContributionCommandValidator()
    {
        RuleFor(x => x.Request.Id)
            .GreaterThan(0)
            .WithMessage("Contribution ID must be greater than zero.");

        RuleFor(x => x.Request.Status)
            .Must(status => status == 2 || status == 3)
            .WithMessage("Status must be Approved or Rejected.");

        When(
            x => x.Request.Status == 2,
            () =>
            {
                RuleFor(x => x.Request.Position)
                    .GreaterThan(0)
                    .When(x => x.Request.Position.HasValue)
                    .WithMessage("Position must be greater than zero.");

                RuleFor(x => x.Request.ParentSubTopicId)
                    .GreaterThan(0)
                    .When(x => x.Request.ParentSubTopicId.HasValue)
                    .WithMessage("ParentSubTopicId must be greater than zero.");
            });

        When(
            x => x.Request.Status == 3,
            () =>
            {
                RuleFor(x => x.Request.Position)
                    .Null()
                    .WithMessage(
                        "Position should not be provided when rejecting a contribution.");

                RuleFor(x => x.Request.ParentSubTopicId)
                    .Null()
                    .WithMessage(
                        "ParentSubTopicId should not be provided when rejecting a contribution.");
            });

        RuleFor(x => x.Request.ReviewNotes)
            .MaximumLength(2000)
            .When(x => x.Request.ReviewNotes is not null);
    }
}