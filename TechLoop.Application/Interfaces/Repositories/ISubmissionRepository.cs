using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ISubmissionRepository
{
    Task<bool> ExistsAsync(Guid userId, int questionId, CancellationToken cancellationToken);
    Task<int> CreateAsync(Submission submission, CancellationToken cancellationToken);
    Task<int> UpdateResultAsync(Submission submission, CancellationToken cancellationToken);
    Task<Submission?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<IEnumerable<Submission>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<IEnumerable<Submission>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken);
    Task<int> GetNextAttemptNumberAsync(Guid userId, int questionId, CancellationToken cancellationToken);
}