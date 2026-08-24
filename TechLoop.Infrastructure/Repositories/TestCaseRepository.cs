using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class TestCaseRepository : ITestCaseRepository
{
    private readonly IDapperContext _context;
    public TestCaseRepository(IDapperContext context)
    {
        _context = context;
    }

    // Position Exists
    public async Task<bool> PositionExistsAsync(int questionId, int position, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_test_case_position_exists(@QuestionId, @Position);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId,
                    Position = position
                },
                cancellationToken: cancellationToken));
    }

    // Create
    public async Task<int> CreateAsync(TestCase testCase, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_test_case( @QuestionId, @Input, @ExpectedOutput, @IsHidden, @Position, @CreatedBy,@CreatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql, testCase, cancellationToken: cancellationToken));
    }

    // Update
    public async Task<int> UpdateAsync(TestCase testCase, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_update_test_case( @Id, @Input, @ExpectedOutput, @IsHidden, @Position,@UpdatedBy,@UpdatedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(sql, testCase, cancellationToken: cancellationToken));
    }

    // Soft Delete
    public async Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_soft_delete_test_case(@Id,@DeletedBy,@DeletedAt);";
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
                sql,
                new
                {
                    Id = id,
                    DeletedBy = deletedBy,
                    DeletedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));

        var stillExists = await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
            "SELECT EXISTS (SELECT 1 FROM test_cases WHERE id = @Id AND deleted_at IS NULL);",
            new { Id = id },
            cancellationToken: cancellationToken));

        return stillExists ? 0 : 1;
    }

    // Soft Delete By Question
    public async Task<int> SoftDeleteByQuestionIdAsync(int questionId, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_soft_delete_test_case_by_question(@QuestionId, @DeletedBy,@DeletedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId,
                    DeletedBy = deletedBy,
                    DeletedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));
    }

    // Get By Id
    public async Task<TestCase?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_test_case_by_id(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<TestCase>(new CommandDefinition(sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }

    // Get By Question
    public async Task<IEnumerable<TestCase>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_test_cases_by_question_id(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<TestCase>(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }

    // Get Visible Test Cases (Learner)
    public async Task<IEnumerable<TestCase>> GetVisibleByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_visible_test_cases_by_question_id(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<TestCase>(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }
}