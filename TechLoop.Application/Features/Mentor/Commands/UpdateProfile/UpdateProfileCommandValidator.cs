using FluentValidation;

namespace TechLoop.Application.Features.Mentor.Commands.UpdateProfile;

public sealed class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidator()
    {
        // RuleFor(x => x.Email)
        //     .NotEmpty()
        //     .Must(email => email == email.Trim())
        //     .WithMessage("Email cannot contain leading or trailing spaces.")
        //     .EmailAddress()
        //     .WithMessage("Please enter a valid email address.")
        //     .Matches(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$")
        //     .WithMessage("Invalid email format.");
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches("[A-Z]")
            .WithMessage("Password must contain an uppercase letter.")
            .Matches("[a-z]")
            .WithMessage("Password must contain a lowercase letter.")
            .Matches("[0-9]")
            .WithMessage("Password must contain a digit.")
            .Matches("[^a-zA-Z0-9]")
            .WithMessage("Password must contain a special character.");
        RuleFor(x => x.ConfirmPassword)
            .NotEmpty()
            .Equal(x => x.Password)
            .WithMessage("Password and Confirm Password do not match.");
        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20)
            .Matches(@"^[0-9+\-\s()]*$")
            .When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber))
            .WithMessage("Phone number contains invalid characters.");
        RuleFor(x => x.Bio)
            .MaximumLength(1000);
        RuleFor(x => x.LinkedInUrl)
            .MaximumLength(500)
            .Must(url => string.IsNullOrWhiteSpace(url) || Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Invalid LinkedIn URL.");
        RuleFor(x => x.GithubUrl)
            .MaximumLength(500)
            .Must(url => string.IsNullOrWhiteSpace(url) || Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Invalid GitHub URL.");
        RuleFor(x => x.ProfileImageUrl)
            .MaximumLength(500);
    }
}