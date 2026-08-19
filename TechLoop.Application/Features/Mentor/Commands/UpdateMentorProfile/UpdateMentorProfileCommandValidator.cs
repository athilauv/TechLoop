using FluentValidation;

namespace TechLoop.Application.Features.Mentor.Commands.UpdateMentorProfile;

public sealed class UpdateMentorProfileCommandValidator : AbstractValidator<UpdateMentorProfileCommand>
{
    public UpdateMentorProfileCommandValidator()
    {
        RuleFor(x => x.PhoneNumber)
            .MaximumLength(20)
            .Matches(@"^[0-9+\-\s()]*$")
            .When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber))
            .WithMessage("Phone number contains invalid characters.");

        RuleFor(x => x.Bio)
            .MaximumLength(1000);

        RuleFor(x => x.LinkedInUrl)
            .MaximumLength(500)
            .Must(url =>
                string.IsNullOrWhiteSpace(url) ||
                Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Invalid LinkedIn URL.");

        RuleFor(x => x.GithubUrl)
            .MaximumLength(500)
            .Must(url =>
                string.IsNullOrWhiteSpace(url) ||
                Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Invalid GitHub URL.");

        RuleFor(x => x.ProfileImageUrl)
            .MaximumLength(500);
    }
}