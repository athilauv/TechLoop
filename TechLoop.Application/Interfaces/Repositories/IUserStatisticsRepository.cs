using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IUserStatisticsRepository
{
    Task UpdateMcqStatisticsAsync(Guid userId, bool isCorrect, CancellationToken cancellationToken);
}