using FluentValidation;
using TechLoop.Application.Features.Technologies.DTOs;

namespace TechLoop.Application.Features.Technologies.Commands.UpdateTechnology;

public sealed class UpdateTechnologyCommandValidator
    : AbstractValidator<UpdateTechnologyRequest>
{
    public UpdateTechnologyCommandValidator()
    {
        RuleFor(x => x.CategoryId)
            .GreaterThan(0)
            .WithMessage("Category is required.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required.")
            .MaximumLength(500);

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required.")
            .MaximumLength(100000);

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500);

        RuleFor(x => x.Position)
            .NotEmpty()
            .WithMessage("Position is required.")
            .GreaterThanOrEqualTo(0);
    }
}
