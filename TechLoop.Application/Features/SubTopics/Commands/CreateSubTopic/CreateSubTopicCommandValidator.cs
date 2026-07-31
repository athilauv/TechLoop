using FluentValidation;

namespace TechLoop.Application.Features.SubTopics.Commands.CreateSubTopic;

public class CreateSubTopicCommandValidator : AbstractValidator<CreateSubTopicCommand>
{
    public CreateSubTopicCommandValidator()
    {
        RuleFor(x => x.TopicId)
            .GreaterThan(0)
            .WithMessage("Topic Id is required.");

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required.")
            .MaximumLength(500);

        RuleFor(x => x.Slug)
            .NotEmpty();

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required.");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500)
            .WithMessage("Image URL must not exceed 500 characters.");

        RuleFor(x => x.Position)
            .GreaterThan(0)
            .WithMessage("Position must be greater than 0.");
    }
}