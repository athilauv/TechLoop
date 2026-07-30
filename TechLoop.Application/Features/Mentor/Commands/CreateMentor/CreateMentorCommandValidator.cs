using FluentValidation;

namespace TechLoop.Application.Features.Mentor.Commands.CreateMentor;

public sealed class CreateMentorCommandValidator : AbstractValidator<CreateMentorCommand>
{
    public CreateMentorCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .WithMessage("Username is required.")
            .MaximumLength(100);
        RuleFor(x => x.Email)
            .NotEmpty()
            .Must(email => email == email.Trim())
            .WithMessage("Email cannot contain leading or trailing spaces.")
            .EmailAddress()
            .WithMessage("Please enter a valid email address.")
            .Matches(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$")
            .WithMessage("Invalid email format.");
        RuleFor(x => x.TechnologyId)
            .GreaterThan(0);
    }
}