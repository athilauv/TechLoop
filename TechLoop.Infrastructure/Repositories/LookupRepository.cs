using Dapper;
using TechLoop.Application.Features.Lookups.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Infrastructure.Repositories;

public sealed class LookupRepository : ILookupRepository
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

    public LookupRepository(IDapperContext context)
    {
        _context = context;
    }

    public Task<IEnumerable<LookupOptionResponse>> GetDifficultyLevelsAsync(
        CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = "SELECT * FROM public.fn_get_difficulty_levels();";
        

            return await connection.QueryAsync<LookupOptionResponse>(
                new CommandDefinition(sql, cancellationToken: cancellationToken));
    
    });
    }

    public Task<IEnumerable<LookupOptionResponse>> GetQuestionTypesAsync(
        CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = "SELECT * FROM public.fn_get_question_types();";
        

            return await connection.QueryAsync<LookupOptionResponse>(
                new CommandDefinition(sql, cancellationToken: cancellationToken));
    
    });
    }

    public Task<IEnumerable<LookupOptionResponse>> GetExampleTypesAsync(
        CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
            const string sql = "SELECT * FROM public.fn_get_example_types();";
        

            return await connection.QueryAsync<LookupOptionResponse>(
                new CommandDefinition(sql, cancellationToken: cancellationToken));
    
    });
    }
}
