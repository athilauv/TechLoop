using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;
public sealed class CodingTemplateRepository : ICodingTemplateRepository
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
    public CodingTemplateRepository(IDapperContext context)
    {
        _context = context;
    }

    public Task<bool> ExistsAsync(int questionId, int technologyId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_coding_template_exists(@QuestionId, @TechnologyId);";
            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                    sql,
                    new
                    {
                        QuestionId = questionId,
                        TechnologyId = technologyId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<int> CreateAsync(CodingTemplate template, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT fn_create_coding_template(@QuestionId, @TechnologyId, @StarterCode, @ExecutionCode, @SolutionCode, @CreatedBy, @CreatedAt);";
            return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql, template, cancellationToken: cancellationToken));
    
    });
    }

    public Task<int> UpdateAsync(CodingTemplate template, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_update_coding_template(@Id, @TechnologyId, @StarterCode, @ExecutionCode, @SolutionCode, @UpdatedBy, @UpdatedAt);";
            return await connection.ExecuteAsync(new CommandDefinition(sql, template, cancellationToken: cancellationToken));
    
    });
    }

    public Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_soft_delete_coding_template( @Id,@DeletedBy, @DeletedAt);";
            await connection.ExecuteAsync(new CommandDefinition(sql,
                    new
                    {
                        Id = id,
                        DeletedBy = deletedBy,
                        DeletedAt = DateTime.UtcNow
                    },
                    cancellationToken: cancellationToken));

            var stillExists = await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                "SELECT EXISTS (SELECT 1 FROM coding_templates WHERE id = @Id AND deleted_at IS NULL);",
                new { Id = id },
                cancellationToken: cancellationToken));

            return stillExists ? 0 : 1;
    
    });
    }

    public Task<int> SoftDeleteByQuestionIdAsync(int questionId, Guid deletedBy, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"CALL sp_soft_delete_coding_template_by_question(@QuestionId, @DeletedBy, @DeletedAt);";
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

    public Task<CodingTemplate?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_coding_template_by_id(@Id);";
        
            return await connection.QuerySingleOrDefaultAsync<CodingTemplate>(new CommandDefinition(sql,
                    new
                    {
                        Id = id
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<IEnumerable<CodingTemplate>> GetByQuestionIdAsync(int questionId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = @"SELECT * FROM fn_get_coding_templates_by_question_id(@QuestionId);";
        
            return await connection.QueryAsync<CodingTemplate>(new CommandDefinition(sql,
                    new
                    {
                        QuestionId = questionId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }
}
