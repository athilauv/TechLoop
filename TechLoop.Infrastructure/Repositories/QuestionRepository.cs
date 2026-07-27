using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class QuestionRepository : IQuestionRepository
{
    private readonly IDapperContext _context;
    public QuestionRepository(IDapperContext context)
    {
        _context = context;
    }

    // Checks if the specified slug already exists
    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_slug_exists(@Slug);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                sql,
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }

    // Checks if the specified position is already assigned within the subtopic
    public async Task<bool> PositionExistsAsync(int subTopicId, int position, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_position_exists(@SubTopicId, @Position);";

        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    SubTopicId = subTopicId,
                    Position = position
                },
                cancellationToken: cancellationToken));
    }

    // Checks if the specified subtopic exists
    public async Task<bool> SubTopicExistsAsync(int subTopicId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_subtopic_exists(@SubTopicId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                new
                {
                    SubTopicId = subTopicId
                },
                cancellationToken: cancellationToken));
    }

    // Creates a new question and returns the generated ID
    public async Task<int> CreateAsync(Question question, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_question(@SubTopicId,@QuestionType,@Slug,@Title,@Description,@ImageUrl,@Mark,@Hint,@Explanation,@TimeLimitSeconds,@MemoryLimitMb,@Difficulty,@Position,@CreatedBy,@CreatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql, question, cancellationToken: cancellationToken));
    }

    // Retrieves a question by its ID
    public async Task<Question?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_question_by_id(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Question>(new CommandDefinition(sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }

    // Updates the specified question
    public async Task<int> UpdateAsync(Question question, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_update_question( @Id, @SubTopicId, @QuestionType, @Slug, @Title, @Description, @ImageUrl, @Mark, @Hint, @Explanation, @TimeLimitSeconds, @MemoryLimitMb, @Difficulty, @Position, @UpdatedBy, @UpdatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(sql, question, cancellationToken: cancellationToken));
    }

    // Soft deletes the specified question
    public async Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_soft_delete_question(@Id, @DeletedBy, @DeletedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(
            new CommandDefinition(sql,
                new
                {
                    Id = id,
                    DeletedBy = deletedBy,
                    DeletedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));
    }

    // Retrieves all active questions
    public async Task<IEnumerable<Question>> GetAllAsync(CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_all_questions();";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Question>(new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    // Publishes the specified question
    public async Task<int> PublishAsync(
        Question question,
        CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_publish_question(@Id, @PublishedBy, @PublishedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    question.Id,
                    question.PublishedBy,
                    question.PublishedAt
                },
                cancellationToken: cancellationToken));
    }

    // Retrieves all published questions
    public async Task<IEnumerable<Question>> GetPublishedAsync(
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_questions();";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Question>(new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    // Retrieves a published question by its ID
    public async Task<Question?> GetPublishedByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_question_by_id(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Question>(
            new CommandDefinition(sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }
}