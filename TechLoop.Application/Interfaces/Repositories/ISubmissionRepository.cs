using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ISubmissionRepository
{
    // Exists
    Task<bool> ExistsAsync(Guid userId, int questionId, CancellationToken cancellationToken);
    // Create
    Task<int> CreateAsync(Submission submission, CancellationToken cancellationToken);
    // Update Result
    Task<int> UpdateResultAsync(Submission submission, CancellationToken cancellationToken);
    // Get By Id
    Task<Submission?> GetByIdAsync(int id, CancellationToken cancellationToken);
    // Get By User
    Task<IEnumerable<Submission>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    // Get By Question
    Task<IEnumerable<Submission>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken);
}