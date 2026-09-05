using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class TestCaseRepository : ITestCaseRepository
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
    public TestCaseRepository(IDapperContext context)
    {
        _context = context;
    }

    // Position Exists
    public Task<bool> PositionExistsAsync(int questionId, int position, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_test_case_position_exists(@QuestionId, @Position);";
        
            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId,
                        Position = position
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Create
    public Task<int> CreateAsync(TestCase testCase, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_create_test_case( @QuestionId, @Input, @ExpectedOutput, @IsHidden, @Position, @CreatedBy,@CreatedAt);";
        
            return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql, testCase, cancellationToken: cancellationToken));
    
    });
    }

    // Update
    public Task<int> UpdateAsync(TestCase testCase, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_update_test_case( @Id, @Input, @ExpectedOutput, @IsHidden, @Position,@UpdatedBy,@UpdatedAt);";
        
            return await connection.ExecuteAsync(new CommandDefinition(sql, testCase, cancellationToken: cancellationToken));
    
    });
    }

    // Soft Delete
    public Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_soft_delete_test_case(@Id,@DeletedBy,@DeletedAt);";
        
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
    
    });
    }

    // Soft Delete By Question
    public Task<int> SoftDeleteByQuestionIdAsync(int questionId, Guid deletedBy, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_soft_delete_test_case_by_question(@QuestionId, @DeletedBy,@DeletedAt);";
        
            return await connection.ExecuteAsync(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId,
                        DeletedBy = deletedBy,
                        DeletedAt = DateTime.UtcNow
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get By Id
    public Task<TestCase?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_test_case_by_id(@Id);";
        
            return await connection.QuerySingleOrDefaultAsync<TestCase>(new CommandDefinition(sql,
                    new
                    {
                        Id = id
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get By Question
    public Task<IEnumerable<TestCase>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_test_cases_by_question_id(@QuestionId);";
        
            return await connection.QueryAsync<TestCase>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get Visible Test Cases (Learner)
    public Task<IEnumerable<TestCase>> GetVisibleByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_visible_test_cases_by_question_id(@QuestionId);";
        
            return await connection.QueryAsync<TestCase>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }
}