using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public class SubmissionRepository : ISubmissionRepository
{
    private readonly IDapperContext _context;
    public SubmissionRepository(IDapperContext context)
    {
        _context = context;
    }

    // Checks if the user has already submitted the specified question
    public async Task<bool> ExistsAsync(Guid userId, int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_submission_exists(@UserId, @QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                new
                {
                    UserId = userId,
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }

    // Creates a new submission and returns the generated ID
    public async Task<int> CreateAsync(Submission submission, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_submission(@UserId,@QuestionId,@TechnologyId,@SourceCode,@Status,@SubmittedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(
            new CommandDefinition(
                sql,
                new
                {
                    submission.UserId,
                    submission.QuestionId,
                    submission.TechnologyId,
                    submission.SourceCode,
                    Status = submission.Status.ToString(),
                    submission.SubmittedAt
                },
                cancellationToken: cancellationToken));
    }

// Retrieves a submission by its ID
    public async Task<Submission?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_submission_by_id(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Submission>(
            new CommandDefinition(sql,
                new { Id = id },
                cancellationToken: cancellationToken));
    }
    
    // Retrieves all submissions of the specified user
    public async Task<IEnumerable<Submission>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_user_submissions(@UserId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Submission>(
            new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }

    // Retrieves all submissions for the specified question
    public async Task<IEnumerable<Submission>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_question_submissions(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Submission>(new CommandDefinition(
                sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }

    // Updates the execution result of the specified submission
    public async Task<int> UpdateResultAsync(Submission submission, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_update_submission_result(@Id,@Status,@ExecutionTimeMs,@MemoryUsedMb,@PassedTestCases,@TotalTestCases,@Score,@CompilerOutput,@RuntimeOutput,@AiReview,@JudgeToken);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    submission.Id,
                    Status = submission.Status.ToString(),
                    submission.ExecutionTimeMs,
                    submission.MemoryUsedMb,
                    submission.PassedTestCases,
                    submission.TotalTestCases,
                    submission.Score,
                    submission.CompilerOutput,
                    submission.RuntimeOutput,
                    submission.AiReview,
                    submission.JudgeToken
                },
                cancellationToken: cancellationToken));
    }
}