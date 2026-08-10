using System.Data;
using Dapper;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class TechnologyRepository : ITechnologyRepository
{
    private readonly IDapperContext _context;

    public TechnologyRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }
    
    public Task<bool> ExistsAsync(int categoryId, string name, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_technology_exists(@CategoryId,@Name);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        CategoryId = categoryId,
                        Name = name
                    },
                    cancellationToken: cancellationToken)));
    }
    
    public Task<int> CreateAsync(Technology technology, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_technology(@Name, @Slug, @Description, @ImageUrl, @Position, @CreatedBy, @CreatedAt);";
        return WithConnection(connection => connection.ExecuteScalarAsync<int>(
            new CommandDefinition(sql, technology, cancellationToken: cancellationToken)));
    }
    
    public Task<int> UpdateAsync(Technology technology, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_update_technology( @Id, @CategoryId, @Name, @Slug, @Description, @ImageUrl, @Position, @UpdatedBy);";
        return WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(sql, technology, cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<Technology>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM public.fn_technology_get_all();";
        return WithConnection(connection => connection.QueryAsync<Technology>( new CommandDefinition( sql, cancellationToken: cancellationToken)));
    }

    public Task<Technology?> GetByIdAsync( int id, CancellationToken cancellationToken)
    {
        const string sql = "SELECT * FROM fn_get_technology_by_id(@Id);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<Technology>(
                new CommandDefinition( sql, new { Id = id }, cancellationToken: cancellationToken)));
    }

    // Publish
    public Task<int> PublishAsync(Technology technology, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_publish_technology( @Id, @PublishedBy);";
        return WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(sql,
                    new
                    {
                        technology.Id,
                        technology.PublishedBy
                    },
                    cancellationToken: cancellationToken)));
    }
    
    public Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = "CALL sp_soft_delete_technology(@Id,@DeletedBy);";
        return WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(sql,
                    new
                    {
                        Id = id,
                        DeletedBy = deletedBy
                    },
                    cancellationToken: cancellationToken)));
    }

    // Get Published
    public Task<IEnumerable<Technology>> GetPublishedAsync(CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_technologies();";
        return WithConnection(connection => connection.QueryAsync<Technology>(
            new CommandDefinition(sql, cancellationToken: cancellationToken)));
    }

    // Get Published By Slug
    public Task<Technology?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_technology_by_slug(@Slug);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<Technology>(
                new CommandDefinition(sql,
                    new
                    {
                        Slug = slug
                    },
                    cancellationToken: cancellationToken)));
    }

    // Get Technology Category
    public Task<int?> GetTechnologyIdAsync(int technologyId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_get_technology_category(@TechnologyId);";
        return WithConnection(connection => connection.ExecuteScalarAsync<int?>(
                new CommandDefinition(sql,
                    new
                    {
                        TechnologyId = technologyId
                    },
                    cancellationToken: cancellationToken)));
    }

    // Get Mentor Technology
    public Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_get_mentor_technology(@UserId);";
        return WithConnection(connection => connection.ExecuteScalarAsync<int?>(
                new CommandDefinition(sql, 
                    new
                    {
                        UserId = userId
                    },
                    cancellationToken: cancellationToken)));
    }
    
    public Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_technology_slug_exists(@Slug);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new { Slug = slug },
                    cancellationToken: cancellationToken)));
    }
    
    public Task<bool> PositionExistsAsync(int categoryId, int position, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_technology_position_exists(@CategoryId,@Position);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(sql,
                    new
                    {
                        CategoryId = categoryId,
                        Position = position
                    },
                    cancellationToken: cancellationToken)));
    }
    
    public Task<bool> CategoryExistsAsync(int categoryId, CancellationToken cancellationToken)
    {
        const string sql = "SELECT fn_technology_category_exists(@CategoryId);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(sql,
                    new { CategoryId = categoryId },
                    cancellationToken: cancellationToken)));
    }
    
    public async Task<int> GetJudge0LanguageIdAsync(int technologyId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_get_judge0_language_id(@TechnologyId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql,
                new
                {
                    TechnologyId = technologyId
                },
                cancellationToken: cancellationToken));
    }

}
