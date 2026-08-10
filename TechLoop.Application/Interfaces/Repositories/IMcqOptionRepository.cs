using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IMcqOptionRepository
{
    Task<int> CreateAsync(McqOption option, CancellationToken cancellationToken);
    Task<int> UpdateAsync( McqOption option, CancellationToken cancellationToken);
    Task<int> SoftDeleteAsync( int id, Guid deletedBy, CancellationToken cancellationToken);
    Task<int> SoftDeleteByQuestionIdAsync(int questionId, Guid deletedBy, CancellationToken cancellationToken);
    Task<IEnumerable<McqOption>> GetByQuestionIdAsync( int questionId, CancellationToken cancellationToken);
    Task<bool> HasCorrectOptionAsync( int questionId, CancellationToken cancellationToken);
    Task<McqOption?> GetByIdAsync( int id, CancellationToken cancellationToken);
    Task<bool> ExistsAsync( int questionId, string optionText, CancellationToken cancellationToken);
    Task<bool> PositionExistsAsync( int questionId, int position, CancellationToken cancellationToken);
    Task<int> GetOptionCountAsync(int questionId, CancellationToken cancellationToken);
    Task<bool?> IsCorrectOptionAsync(int questionId, int optionId, CancellationToken cancellationToken);

}