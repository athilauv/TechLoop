using FluentValidation;

namespace TechLoop.Application.Features.Mentor.Commands.DeleteMentor;

public sealed class DeleteMentorCommandValidator
    : AbstractValidator<DeleteMentorCommand>
{
    public DeleteMentorCommandValidator()
    {
        RuleFor(x => x.MentorId)
            .GreaterThan(0)
            .WithMessage("Mentor id must be greater than zero.");
    }
}
