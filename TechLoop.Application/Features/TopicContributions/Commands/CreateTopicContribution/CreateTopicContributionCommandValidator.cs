using FluentValidation;

namespace TechLoop.Application.Features.TopicContributions.Commands.CreateTopicContribution;

public sealed class CreateTopicContributionCommandValidator : AbstractValidator<CreateTopicContributionCommand>
{
    public CreateTopicContributionCommandValidator()
    {
        RuleFor(x => x.Request.TechnologyId)
            .GreaterThan(0)
            .WithMessage("Technology is required.");

        RuleFor(x => x.Request.Title)
            .NotEmpty()
            .MaximumLength(255);

        RuleFor(x => x.Request.Description)
            .NotEmpty();

        RuleFor(x => x.Request.ReferenceUrl)
            .MaximumLength(500)
            .When(x => !string.IsNullOrWhiteSpace(x.Request.ReferenceUrl));

        RuleFor(x => x.Request.Example)
            .MaximumLength(5000)
            .When(x => !string.IsNullOrWhiteSpace(x.Request.Example));
    }
}