using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.UserStatistics.Queries.GetUserStatistics;

public sealed class GetUserStatisticsQueryHandler : IRequestHandler<GetUserStatisticsQuery, GetUserStatisticsResponse>
{
    private readonly IUserStatisticsRepository _repository;
    public GetUserStatisticsQueryHandler(IUserStatisticsRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetUserStatisticsResponse> Handle(GetUserStatisticsQuery request, CancellationToken cancellationToken)
    {
        var statistics = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (statistics is null)
        {
            throw new NotFoundException("User statistics not found.");
        }

        return new GetUserStatisticsResponse
        {
            Id = statistics.Id,
            UserId = statistics.UserId,
            ReputationPoints = statistics.ReputationPoints,
            QuestionsSolved = statistics.QuestionsSolved,
            CodingSolved = statistics.CodingSolved,
            McqSolved = statistics.McqSolved,
            TotalSubmissions = statistics.TotalSubmissions,
            AcceptedSubmissions = statistics.AcceptedSubmissions,
            FailedSubmissions = statistics.FailedSubmissions,
            TotalTimeSpentMinutes = statistics.TotalTimeSpentMinutes,
            CreatedAt = statistics.CreatedAt,
            UpdatedAt = statistics.UpdatedAt
        };
    }
}