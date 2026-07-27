using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;
public sealed class McqOptionRepository : IMcqOptionRepository
{
    private readonly IDapperContext _context;
    public McqOptionRepository(IDapperContext context)
    {
        _context = context;
    }

    // Exists
    public async Task<bool> ExistsAsync(int questionId, string optionText, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_mcq_option_exists(@QuestionId, @OptionText);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId,
                    OptionText = optionText
                },
                cancellationToken: cancellationToken));
    }

    // Position Exists
    public async Task<bool> PositionExistsAsync(int questionId, int position, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_mcq_option_position_exists(@QuestionId, @Position);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId,
                    Position = position
                },
                cancellationToken: cancellationToken));
    }

    // Option Count
    public async Task<int> GetOptionCountAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_mcq_option_count(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }

    // Create
    public async Task<int> CreateAsync(McqOption option, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_mcq_option(@QuestionId,@OptionText,@IsCorrect,@Position,@CreatedBy,@CreatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql, option, cancellationToken: cancellationToken));
    }

    // Update
    public async Task<int> UpdateAsync(McqOption option, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_update_mcq_option(@Id,@OptionText,@IsCorrect,@Position,@UpdatedBy,@UpdatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(sql, option, cancellationToken: cancellationToken));
    }

    // Soft Delete
    public async Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_soft_delete_mcq_option(@Id,@DeletedBy,@DeletedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(
                sql,
                new
                {
                    Id = id,
                    DeletedBy = deletedBy,
                    DeletedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));
    }

    // Soft Delete By Question
    public async Task<int> SoftDeleteByQuestionIdAsync(int questionId, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_soft_delete_mcq_option_by_question(@QuestionId,@DeletedBy,@DeletedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(
                sql,
                new
                {
                    QuestionId = questionId,
                    DeletedBy = deletedBy,
                    DeletedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));
    }

    // Has Correct Option
    public async Task<bool> HasCorrectOptionAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_mcq_has_correct_option(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }

    // Get By Id
    public async Task<McqOption?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_mcq_option_by_id(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<McqOption>(new CommandDefinition(sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }

    // Get By Question
    public async Task<IEnumerable<McqOption>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_mcq_options_by_question_id(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<McqOption>(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }
}