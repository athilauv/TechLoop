using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;
public sealed class McqOptionRepository : IMcqOptionRepository
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
    public McqOptionRepository(IDapperContext context)
    {
        _context = context;
    }

    // Exists
    public Task<bool> ExistsAsync(int questionId, string optionText, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_mcq_option_exists(@QuestionId, @OptionText);";
        
            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId,
                        OptionText = optionText
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Position Exists
    public Task<bool> PositionExistsAsync(int questionId, int position, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_mcq_option_position_exists(@QuestionId, @Position);";
        
            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId,
                        Position = position
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Option Count
    public Task<int> GetOptionCountAsync(int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_mcq_option_count(@QuestionId);";
        
            return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Create
    public Task<int> CreateAsync(McqOption option, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL public.sp_manage_mcq_option(
                'CREATE', NULL, @QuestionId, @OptionText, @IsCorrect, @Position,
                @CreatedBy, NULL, NULL);";
        
            await connection.ExecuteAsync(new CommandDefinition(sql, option, cancellationToken: cancellationToken));
            return 1;
    
    });
    }

    // Update
    public Task<int> UpdateAsync(McqOption option, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_update_mcq_option(@Id,@OptionText,@IsCorrect,@Position,@UpdatedBy,@UpdatedAt);";
        
            return await connection.ExecuteAsync(new CommandDefinition(sql, option, cancellationToken: cancellationToken));
    
    });
    }

    // Soft Delete
    public Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_soft_delete_mcq_option(@Id,@DeletedBy,@DeletedAt);";
        
            return await connection.ExecuteAsync(new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id,
                        DeletedBy = deletedBy,
                        DeletedAt = DateTime.UtcNow
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Soft Delete By Question
    public Task<int> SoftDeleteByQuestionIdAsync(int questionId, Guid deletedBy, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_soft_delete_mcq_option_by_question(@QuestionId,@DeletedBy,@DeletedAt);";
        
            return await connection.ExecuteAsync(new CommandDefinition(
                    sql,
                    new
                    {
                        QuestionId = questionId,
                        DeletedBy = deletedBy,
                        DeletedAt = DateTime.UtcNow
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Has Correct Option
    public Task<bool> HasCorrectOptionAsync(int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_mcq_has_correct_option(@QuestionId);";
        
            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                    sql,
                    new
                    {
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get By Id
    public Task<McqOption?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_mcq_option_by_id(@Id);";
        
            return await connection.QuerySingleOrDefaultAsync<McqOption>(new CommandDefinition(sql,
                    new
                    {
                        Id = id
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get By Question
    public Task<IEnumerable<McqOption>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_mcq_options_by_question_id(@QuestionId);";
        
            return await connection.QueryAsync<McqOption>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }
    
    public Task<bool?> IsCorrectOptionAsync(int questionId, int optionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = """
                               SELECT public.fn_mcq_option_is_correct( @QuestionId, @OptionId);
                               """;
        
            return await connection.QuerySingleOrDefaultAsync<bool?>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId,
                        OptionId = optionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }
}