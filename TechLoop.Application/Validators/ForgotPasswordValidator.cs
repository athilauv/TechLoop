using FluentValidation;
using TechLoop.Application.DTOs.Auth;

namespace TechLoop.Application.Validators;

public class ForgotPasswordRequestValidator
    : AbstractValidator<ForgotPasswordRequest>
{
    public ForgotPasswordRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .Must(email => email == email.Trim())
            .WithMessage("Email cannot contain leading or trailing spaces.")
            .EmailAddress()
            .WithMessage("Please enter a valid email address.")
            .Matches(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$")
            .WithMessage("Invalid email format.");
    }
}