using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IUserStatisticsRepository
{
    Task UpdateMcqStatisticsAsync(Guid userId, bool isCorrect, CancellationToken cancellationToken);
    Task<UserStatistics?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<Guid> CreateAsync(UserStatistics statistics, CancellationToken cancellationToken);
    Task<int> UpdateAsync(UserStatistics statistics, CancellationToken cancellationToken);
    //Task<bool> IsQuestionSolvedAsync(Guid userId, int questionId, CancellationToken cancellationToken);
}