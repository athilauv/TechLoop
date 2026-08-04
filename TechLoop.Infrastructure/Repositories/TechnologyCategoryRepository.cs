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

    // Connection Helper
    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }
    
    // Create
    public Task<int> CreateAsync(TechnologyCategory technologyCategory, CancellationToken cancellationToken)
    {
        const string sql = "CALL sp_technology_category_create(@Name,@CreatedBy);";
        return WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(
                    sql,
                    new
                    {
                        technologyCategory.Name,
                        technologyCategory.CreatedBy
                    },
                    cancellationToken: cancellationToken)));
    }
    
    // Update
    public Task<int> UpdateAsync(TechnologyCategory technologyCategory, CancellationToken cancellationToken)
    {
        const string sql = "CALL sp_technology_category_update(@Id,@Name,@UpdatedBy);";
        return WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(
                    sql,
                    new
                    {
                        technologyCategory.Id,
                        technologyCategory.Name,
                        technologyCategory.UpdatedBy
                    },
                    cancellationToken: cancellationToken)));
    }
    
    // Publish
    public Task<int> PublishAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = "CALL sp_technology_category_publish(@Id);";
        return WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id
                    },
                    cancellationToken: cancellationToken)));
    }
    
    // Delete
    public Task<int> DeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = "CALL sp_technology_category_delete(@Id,@DeletedBy);";
        return WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id,
                        DeletedBy = deletedBy
                    },
                    cancellationToken: cancellationToken)));
    }

    // Get All (Admin)
    public Task<IEnumerable<AdminTechnologyCategoryResponse>> GetAllForAdminAsync()
    {
        const string sql = "SELECT * FROM fn_technology_category_get_all();";
        return WithConnection(connection => connection.QueryAsync<AdminTechnologyCategoryResponse>(sql));
    }
    
    // Get All (Public)
    public Task<IEnumerable<LearnerMentorTechnologyCategoryResponse>> GetAllForPublicAsync()
    {
        const string sql = "SELECT * FROM fn_technology_category_get_all();";
        return WithConnection(connection => connection.QueryAsync<LearnerMentorTechnologyCategoryResponse>(sql));
    }

    // Get By Id (Admin)
    public Task<AdminTechnologyCategoryResponse?> GetByIdForAdminAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM fn_technology_category_get_by_id(@Id);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<AdminTechnologyCategoryResponse>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id
                    },
                    cancellationToken: cancellationToken)));
    }
    
    // Get By Id (Public)
    public Task<LearnerMentorTechnologyCategoryResponse?> GetByIdForPublicAsync(int id)
    {
        const string sql = "SELECT * FROM fn_technology_category_get_by_id(@Id);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<LearnerMentorTechnologyCategoryResponse>(
                sql,
                new
                {
                    Id = id
                }));
    }

    // Exists
    public Task<bool> ExistsAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_technology_category_exists(@Id);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id
                    },
                    cancellationToken: cancellationToken)));
    }

    // Name Exists
    public Task<bool> NameExistsAsync(string name,int? excludeId, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_technology_category_name_exists(@Name,@ExcludeId);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Name = name,
                        ExcludeId = excludeId
                    },
                    cancellationToken: cancellationToken)));
    }
}