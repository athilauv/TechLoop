using FluentValidation;

namespace TechLoop.Application.Judge0.Queries.GetSubmissionResult;

public sealed class GetSubmissionResultQueryValidator
    : AbstractValidator<GetSubmissionResultQuery>
{
    public GetSubmissionResultQueryValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty()
            .WithMessage("Submission token is required.");
    }
}