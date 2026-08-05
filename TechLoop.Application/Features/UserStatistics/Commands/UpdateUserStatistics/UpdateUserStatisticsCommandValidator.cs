using FluentValidation;

namespace TechLoop.Application.Features.UserStatistics.UpdateUserStatistics;

public sealed class UpdateUserStatisticsCommandValidator : AbstractValidator<UpdateUserStatisticsCommand>
{
    public UpdateUserStatisticsCommandValidator()
    {
        RuleFor(x => x.Submission).NotNull();
    }
}