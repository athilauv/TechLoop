using FluentValidation;

namespace TechLoop.Application.Features.Submissions.Commands.UpdateSubmissionResult;

public sealed class UpdateSubmissionCommandValidator : AbstractValidator<UpdateSubmissionCommand>
{
    public UpdateSubmissionCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Request.TotalTestCases)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Request.TotalTestCases.HasValue);

        RuleFor(x => x.Request.PassedTestCases)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Request.PassedTestCases.HasValue);

        RuleFor(x => x.Request.Score)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Request.Score.HasValue);

        RuleFor(x => x.Request.ExecutionTimeMs)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Request.ExecutionTimeMs.HasValue);

        RuleFor(x => x.Request.MemoryUsedMb)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Request.MemoryUsedMb.HasValue);
    }
}