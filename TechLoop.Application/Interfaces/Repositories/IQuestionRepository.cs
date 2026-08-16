using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface IQuestionRepository
{
    Task<int> CreateAsync(Question question, CancellationToken cancellationToken);
    Task<int> UpdateAsync(Question question, CancellationToken cancellationToken);
    Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken);
    Task<IEnumerable<Question>> GetAllAsync(CancellationToken cancellationToken);
    Task<Question?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<IEnumerable<Question>> GetPublishedAsync(CancellationToken cancellationToken);
    Task<Question?> GetPublishedByIdAsync(int id, CancellationToken cancellationToken);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken);
    Task<bool> PositionExistsAsync(int subTopicId, int position, CancellationToken cancellationToken);
    Task<bool> SubTopicExistsAsync(int subTopicId, CancellationToken cancellationToken);
    Task<int> PublishAsync(Question question, CancellationToken cancellationToken);
    Task<int> GetMcqOptionCountAsync(int questionId, CancellationToken cancellationToken);
    Task<bool> HasCodingTemplateAsync(int questionId, CancellationToken cancellationToken);
    Task<bool> HasTestCasesAsync(int questionId, CancellationToken cancellationToken);
    Task<int?> GetQuestionTechnologyIdAsync(int questionId, CancellationToken cancellationToken);
    Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken);
    Task<Question?> GetPublishedMcqQuestionBySubTopicAsync(int subTopicId, CancellationToken cancellationToken);
    Task<IEnumerable<LearnerCodingQuestionDto>> GetCodingQuestionsAsync(
        int page,
        int pageSize,
        int? technologyId,
        int? difficulty,
        int? subTopicId,
        string? search,
        string? sort,
        CancellationToken cancellationToken);
}