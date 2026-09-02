using System.Data;
using Dapper;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class TechnologyCategoryRepository : ITechnologyCategoryRepository
{
    private readonly IDapperContext _context;
    public TechnologyCategoryRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<int> CreateAsync(TechnologyCategory technologyCategory, CancellationToken cancellationToken)
    {
        const string sql = @"CALL public.sp_manage_technology_category('CREATE', NULL, @Name, @CreatedBy, NULL, NULL, 0);";

        return WithConnection(connection =>
            connection.QuerySingleAsync<int>(new CommandDefinition(
                    sql,
                    new
                    {
                        technologyCategory.Name,
                        technologyCategory.CreatedBy
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<int> UpdateAsync(TechnologyCategory technologyCategory, CancellationToken cancellationToken)
    {
        const string sql = @"CALL public.sp_manage_technology_category('UPDATE', @Id, @Name, NULL, @UpdatedBy, NULL, 0 );";
        return WithConnection(connection =>
            connection.QuerySingleAsync<int>(new CommandDefinition(
                    sql,
                    new
                    {
                        technologyCategory.Id,
                        technologyCategory.Name,
                        technologyCategory.UpdatedBy
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<int> PublishAsync(int id, Guid publishedBy, CancellationToken cancellationToken)
    {
        const string sql = @"
            CALL public.sp_manage_technology_category(
                'PUBLISH',
                @Id,
                NULL,
                NULL,
                @UpdatedBy,
                NULL,
                0
            );";

        return WithConnection(connection =>
            connection.QuerySingleAsync<int>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id,
                        UpdatedBy = publishedBy
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<int> DeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = @"
            CALL public.sp_manage_technology_category(
                'DELETE',
                @Id,
                NULL,
                NULL,
                NULL,
                @DeletedBy,
                0
            );";

        return WithConnection(connection =>
            connection.QuerySingleAsync<int>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id,
                        DeletedBy = deletedBy
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<AdminTechnologyCategoryResponse>> GetAllForAdminAsync()
    {
        const string sql = "SELECT * FROM fn_technology_category_get_all();";
        return WithConnection(connection => connection.QueryAsync<AdminTechnologyCategoryResponse>(sql));
    }

    public Task<IEnumerable<LearnerMentorTechnologyCategoryResponse>> GetAllForPublicAsync()
    {
        const string sql = "SELECT * FROM fn_technology_category_get_all();";
        return WithConnection(connection => connection.QueryAsync<LearnerMentorTechnologyCategoryResponse>(sql));
    }

    public Task<AdminTechnologyCategoryResponse?> GetByIdForAdminAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM fn_technology_category_get_by_id(@Id);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<AdminTechnologyCategoryResponse>(
            new CommandDefinition(sql, new { Id = id }, cancellationToken: cancellationToken)));
    }

    public Task<LearnerMentorTechnologyCategoryResponse?> GetByIdForPublicAsync(int id)
    {
        const string sql = "SELECT * FROM fn_technology_category_get_by_id(@Id);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<LearnerMentorTechnologyCategoryResponse>(
            sql, new { Id = id }));
    }

    public Task<bool> ExistsAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_technology_category_exists(@Id);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(sql, new { Id = id }, cancellationToken: cancellationToken)));
    }

    public Task<bool> NameExistsAsync(string name, int? excludeId, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_technology_category_name_exists(@Name,@ExcludeId);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(sql, new
            {
                Name = name,
                ExcludeId = excludeId
            }, cancellationToken: cancellationToken)));
    }
}
