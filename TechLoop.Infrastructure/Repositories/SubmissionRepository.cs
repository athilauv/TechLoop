using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Infrastructure.Repositories;

public class SubmissionRepository : ISubmissionRepository
{
    private readonly IDapperContext _context;

    private async Task<T> WithConnection<T>(Func<System.Data.IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    private async Task WithConnection(Func<System.Data.IDbConnection, Task> action)
    {
        using var connection = _context.CreateConnection();
        await action(connection);
    }
    public SubmissionRepository(IDapperContext context)
    {
        _context = context;
    }

    public Task<bool> ExistsAsync(Guid userId, int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_submission_exists(@UserId, @QuestionId);";
        
            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                    new
                    {
                        UserId = userId,
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }
    
    public Task<int> CreateAsync(
        Submission submission,
        CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"
                CALL sp_manage_submission(
                    'CREATE',
                    NULL,
                    @UserId,
                    @QuestionId,
                    @TechnologyId,
                    @SourceCode,
                    @Status,
                    @SubmittedAt,
                    @ExecutionTimeMs,
                    @MemoryUsedMb,
                    @PassedTestCases,
                    @TotalTestCases,
                    @Score,
                    @CompilerOutput,
                    @RuntimeOutput,
                    @AiReview,
                    @JudgeToken,
                    @AttemptNumber,
                    @SelectedOptionId
                );";

        
            await connection.ExecuteAsync(new CommandDefinition(
                sql,
                new
                {
                    submission.UserId,
                    submission.QuestionId,
                    submission.TechnologyId,
                    submission.SourceCode,
                    Status = submission.Status switch
                    {
                        SubmissionStatus.Pending => "pending",
                        SubmissionStatus.Accepted => "accepted",
                        SubmissionStatus.WrongAnswer => "wrong_answer",
                        SubmissionStatus.RuntimeError => "runtime_error",
                        SubmissionStatus.CompileError => "compile_error",
                        SubmissionStatus.TimeLimitExceeded => "time_limit_exceeded",
                        SubmissionStatus.MemoryLimitExceeded => "memory_limit_exceeded",
                        _ => throw new ArgumentOutOfRangeException(nameof(submission.Status))
                    },
                    submission.SubmittedAt,
                    submission.ExecutionTimeMs,
                    submission.MemoryUsedMb,
                    submission.PassedTestCases,
                    submission.TotalTestCases,
                    submission.Score,
                    submission.CompilerOutput,
                    submission.RuntimeOutput,
                    submission.AiReview,
                    submission.JudgeToken,
                    submission.AttemptNumber,
                    submission.SelectedOptionId
                },
                cancellationToken: cancellationToken));

            const string idSql = @"
                SELECT id
                FROM public.submissions
                WHERE user_id = @UserId
                  AND question_id = @QuestionId
                  AND attempt_number = @AttemptNumber
                ORDER BY id DESC
                LIMIT 1;";

            return await connection.ExecuteScalarAsync<int>(new CommandDefinition(
                idSql,
                new
                {
                    submission.UserId,
                    submission.QuestionId,
                    submission.AttemptNumber
                },
                cancellationToken: cancellationToken));
    
    });
    }
    

    public Task<Submission?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_submission_by_id(@Id);";
        
            return await connection.QuerySingleOrDefaultAsync<Submission>(
                new CommandDefinition(sql,
                    new { Id = id },
                    cancellationToken: cancellationToken));
    
    });
    }
    
    public Task<IEnumerable<Submission>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_user_submissions(@UserId);";
        
            return await connection.QueryAsync<Submission>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        UserId = userId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<IEnumerable<Submission>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_question_submissions(@QuestionId);";
        
            return await connection.QueryAsync<Submission>(new CommandDefinition(
                    sql,
                    new
                    {
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<int> UpdateResultAsync(Submission submission, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_manage_submission('UPDATE_RESULT', @Id, NULL, NULL, NULL, NULL, @Status, NULL, @ExecutionTimeMs, @MemoryUsedMb, @PassedTestCases, @TotalTestCases, @Score, @CompilerOutput, @RuntimeOutput, @AiReview, @JudgeToken);";
        
            return await connection.ExecuteAsync(
                new CommandDefinition(
                    sql,
                    new
                    {
                        submission.Id,
                        Status = submission.Status switch
                        {
                            SubmissionStatus.Pending => "pending",
                            SubmissionStatus.Accepted => "accepted",
                            SubmissionStatus.WrongAnswer => "wrong_answer",
                            SubmissionStatus.RuntimeError => "runtime_error",
                            SubmissionStatus.CompileError => "compile_error",
                            SubmissionStatus.TimeLimitExceeded => "time_limit_exceeded",
                            SubmissionStatus.MemoryLimitExceeded => "memory_limit_exceeded",
                            _ => throw new ArgumentOutOfRangeException(nameof(submission.Status))
                        },
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
    
    });
    }
    
    public Task<int> GetNextAttemptNumberAsync(Guid userId, int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_get_next_attempt_number(@UserId, @QuestionId);";
        
            return await connection.ExecuteScalarAsync<int>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        UserId = userId,
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }
    
    public Task<bool> IsQuestionSolvedAsync(Guid userId, int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @" SELECT fn_submission_already_solved( @UserId, @QuestionId);";
        
            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                    sql,
                    new
                    {
                        UserId = userId,
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }
}
