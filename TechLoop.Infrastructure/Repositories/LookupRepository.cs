using Dapper;
using TechLoop.Application.Features.Lookups.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Infrastructure.Repositories;

public sealed class LookupRepository : ILookupRepository
{
    private readonly IDapperContext _context;

    public LookupRepository(IDapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<LookupOptionResponse>> GetDifficultyLevelsAsync(
        CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM public.fn_get_difficulty_levels();";
        using var connection = _context.CreateConnection();

        return await connection.QueryAsync<LookupOptionResponse>(
            new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    public async Task<IEnumerable<LookupOptionResponse>> GetQuestionTypesAsync(
        CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM public.fn_get_question_types();";
        using var connection = _context.CreateConnection();

        return await connection.QueryAsync<LookupOptionResponse>(
            new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    public async Task<IEnumerable<LookupOptionResponse>> GetExampleTypesAsync(
        CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM public.fn_get_example_types();";
        using var connection = _context.CreateConnection();

        return await connection.QueryAsync<LookupOptionResponse>(
            new CommandDefinition(sql, cancellationToken: cancellationToken));
    }
}
