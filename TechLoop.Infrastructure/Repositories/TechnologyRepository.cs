using System.Data;
using Dapper;
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

    private async Task<T> WithConnection<T>(
        Func<IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    public Task<bool> ExistsAsync(int categoryId,
        string name, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_technology_exists(@CategoryId, @Name);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        CategoryId = categoryId,
                        Name = name
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> NameExistsAsync(
        int categoryId,
        string name,
        int excludeId,
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_technology_name_exists(@CategoryId, @Name, @ExcludeId);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        CategoryId = categoryId,
                        Name = name,
                        ExcludeId = excludeId
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_technology_slug_exists(@Slug);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new { Slug = slug },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> SlugExistsAsync(string slug, int excludeId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_technology_slug_exists(@Slug, @ExcludeId);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Slug = slug,
                        ExcludeId = excludeId
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> PositionExistsAsync(int categoryId, int position, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_technology_position_exists( @CategoryId, @Position);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        CategoryId = categoryId,
                        Position = position
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> PositionExistsAsync(
        int categoryId, int position, int excludeId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_technology_position_exists( @CategoryId, @Position, @ExcludeId);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        CategoryId = categoryId,
                        Position = position,
                        ExcludeId = excludeId
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> CategoryExistsAsync(
        int categoryId,
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_technology_category_exists(@CategoryId);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    sql,
                    new { CategoryId = categoryId },
                    cancellationToken: cancellationToken)));
    }

    public Task<int> CreateAsync(Technology technology, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_technology_create(
                @CategoryId,
                @Name,
                @Slug,
                @Description,
                @ImageUrl,
                @Position,
                @CreatedBy,
                @CreatedAt
            );";

        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        technology.CategoryId,
                        technology.Name,
                        technology.Slug,
                        technology.Description,
                        technology.ImageUrl,
                        technology.Position,
                        technology.CreatedBy,
                        technology.CreatedAt
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<int> UpdateAsync(Technology technology, CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT fn_technology_update(
                @Id,
                @CategoryId,
                @Name,
                @Slug,
                @Description,
                @ImageUrl,
                @Position,
                @UpdatedBy,
                @UpdatedAt
            );
            """;

        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        technology.Id,
                        technology.CategoryId,
                        technology.Name,
                        technology.Slug,
                        technology.Description,
                        technology.ImageUrl,
                        technology.Position,
                        technology.UpdatedBy,
                        technology.UpdatedAt
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<int> SoftDeleteAsync(
        int id,
        Guid deletedBy,
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT fn_technology_delete(
                @Id,
                @DeletedBy,
                @DeletedAt
            );
            """;

        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id,
                        DeletedBy = deletedBy,
                        DeletedAt = DateTime.UtcNow
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<int> PublishAsync(
        Technology technology,
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT fn_technology_publish(
                @Id,
                @PublishedBy,
                @PublishedAt
            );
            """;

        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        technology.Id,
                        technology.PublishedBy,
                        technology.PublishedAt
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<Technology>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT *
            FROM fn_technology_get_all();
            """;

        return WithConnection(connection =>
            connection.QueryAsync<Technology>(
                new CommandDefinition(
                    sql,
                    cancellationToken: cancellationToken)));
    }

    public Task<Technology?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT *
            FROM fn_get_technology_by_id(@Id);
            """;

        return WithConnection(connection =>
            connection.QuerySingleOrDefaultAsync<Technology>(
                new CommandDefinition(
                    sql,
                    new { Id = id },
                    cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<Technology>> GetPublishedAsync(
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT *
            FROM fn_get_published_technologies();
            """;

        return WithConnection(connection =>
            connection.QueryAsync<Technology>(
                new CommandDefinition(
                    sql,
                    cancellationToken: cancellationToken)));
    }

    public Task<Technology?> GetPublishedBySlugAsync(
        string slug,
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT *
            FROM fn_get_published_technology_by_slug(@Slug);
            """;

        return WithConnection(connection =>
            connection.QuerySingleOrDefaultAsync<Technology>(
                new CommandDefinition(
                    sql,
                    new { Slug = slug },
                    cancellationToken: cancellationToken)));
    }

    public Task<int?> GetTechnologyIdAsync(
        int technologyId,
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT fn_technology_get_category_id(@TechnologyId);
            """;

        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int?>(
                new CommandDefinition(
                    sql,
                    new { TechnologyId = technologyId },
                    cancellationToken: cancellationToken)));
    }

    public Task<int?> GetMentorTechnologyIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT fn_mentor_get_technology_id(@UserId);
            """;

        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int?>(
                new CommandDefinition(
                    sql,
                    new { UserId = userId },
                    cancellationToken: cancellationToken)));
    }

    public Task<int> GetJudge0LanguageIdAsync(
        int technologyId,
        CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT fn_get_judge0_language_id(@TechnologyId);
            """;

        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int>(
                new CommandDefinition(
                    sql,
                    new { TechnologyId = technologyId },
                    cancellationToken: cancellationToken)));
    }
}