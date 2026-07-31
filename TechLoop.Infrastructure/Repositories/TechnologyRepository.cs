using Dapper;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed partial class TechnologyRepository : ITechnologyRepository
{
    private readonly IDapperContext _context;

    public TechnologyRepository(IDapperContext context)
    {
        _context = context;
    }

    // Checks if a technology with the same name already exists
    public async Task<bool> ExistsAsync(
        int categoryId,
        string name,
        CancellationToken cancellationToken)
    {
        const string sql =
            @"SELECT fn_technology_exists(@CategoryId, @Name);";

        using var connection = _context.CreateConnection();

        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    CategoryId = categoryId,
                    Name = name
                },
                cancellationToken: cancellationToken));
    }

    // Checks if the specified slug already exists
    public async Task<bool> SlugExistsAsync(
        string slug,
        CancellationToken cancellationToken)
    {
        const string sql =
            @"SELECT fn_technology_slug_exists(@Slug);";

        using var connection = _context.CreateConnection();

        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }

    
    // Checks if the specified position is already assigned within the category
    public async Task<bool> PositionExistsAsync(
        int categoryId,
        int position,
        CancellationToken cancellationToken)
    {
        const string sql =
            @"SELECT fn_technology_position_exists(@CategoryId, @Position);";

        using var connection = _context.CreateConnection();

        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    CategoryId = categoryId,
                    Position = position
                },
                cancellationToken: cancellationToken));
    }

    
    // Checks if the specified technology category exists.
    public async Task<bool> CategoryExistsAsync(
        int categoryId,
        CancellationToken cancellationToken)
    {
        const string sql =
            @"SELECT fn_technology_category_exists(@CategoryId);";

        using var connection = _context.CreateConnection();

        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    CategoryId = categoryId
                },
                cancellationToken: cancellationToken));
    }

    
    // Creates a new technology and returns the generated ID
    public async Task<int> CreateAsync(Technology technology, CancellationToken cancellationToken)
    {
        const string sql =
            @"
SELECT fn_create_technology
(
    @CategoryId,
    @Name,
    @Slug,
    @Description,
    @ImageUrl,
    @Position,
    @CreatedBy,
    @CreatedAt
);";

        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(
            new CommandDefinition(sql, technology, cancellationToken: cancellationToken));
    }


    // Retrieves a technology by its ID
    public async Task<Technology?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken)
    {
        const string sql =
            @"SELECT * FROM fn_get_technology_by_id(@Id);";

        using var connection = _context.CreateConnection();

        return await connection.QuerySingleOrDefaultAsync<Technology>(
            new CommandDefinition(
                sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }
    
    
    // Updates the specified technology)
public async Task<int> UpdateAsync(Technology technology, CancellationToken cancellationToken)
{
    const string sql = @"CALL sp_update_technology(@Id, @CategoryId, @Name, @Slug, @Description, @ImageUrl, @Position, @UpdatedBy,@UpdatedAt);";
    using var connection = _context.CreateConnection();
    return await connection.ExecuteAsync(new CommandDefinition(sql, technology, cancellationToken: cancellationToken));
}


// Soft deletes the specified technology
public async Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
{
    const string sql = @"CALL sp_soft_delete_technology(@Id, @DeletedBy, @DeletedAt);";
    using var connection = _context.CreateConnection();
    return await connection.ExecuteAsync(
        new CommandDefinition(
            sql,
            new
            {
                Id = id,
                DeletedBy = deletedBy,
                DeletedAt = DateTime.UtcNow
            },
            cancellationToken: cancellationToken));
}



// Retrieves all active technologies
public async Task<IEnumerable<Technology>> GetAllAsync(CancellationToken cancellationToken)
{
    const string sql = @"SELECT * FROM fn_get_all_technologies();";
    using var connection = _context.CreateConnection();
    return await connection.QueryAsync<Technology>(new CommandDefinition(sql, cancellationToken: cancellationToken));
}


// Publishes the specified technology
public async Task<int> PublishAsync(Technology technology, CancellationToken cancellationToken)
{
    const string sql = @"CALL sp_publish_technology( @Id, @PublishedBy, @PublishedAt);";
    using var connection = _context.CreateConnection();
    return await connection.ExecuteAsync(new CommandDefinition(
            sql,
            new
            {
                technology.Id,
                technology.PublishedBy,
                technology.PublishedAt
            },
            cancellationToken: cancellationToken));
}


// Retrieves all published technologies
public async Task<IEnumerable<Technology>> GetPublishedAsync(CancellationToken cancellationToken)
{
    const string sql = @"SELECT * FROM fn_get_published_technologies();";
    using var connection = _context.CreateConnection();
    return await connection.QueryAsync<Technology>(new CommandDefinition(sql, cancellationToken: cancellationToken));
}



// Retrieves a published technology by its slug
public async Task<Technology?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken)
{
    const string sql = @"SELECT * FROM fn_get_published_technology_by_slug(@Slug);";
    using var connection = _context.CreateConnection();
    return await connection.QuerySingleOrDefaultAsync<Technology>(
        new CommandDefinition(
            sql,
            new
            {
                Slug = slug
            },
            cancellationToken: cancellationToken));
}

// Gets the category ID of the specified technology
public async Task<int?> GetTechnologyIdAsync(int technologyId, CancellationToken cancellationToken)
{
    const string sql = @"SELECT fn_get_technology_category(@TechnologyId);";
    using var connection = _context.CreateConnection();
    return await connection.ExecuteScalarAsync<int?>(new CommandDefinition(
            sql,
            new
            {
                TechnologyId = technologyId
            },
            cancellationToken: cancellationToken));
}


// Gets the technology ID assigned to the current mentor
public async Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken)
{
    const string sql = @"SELECT fn_get_mentor_technology(@UserId);";
    using var connection = _context.CreateConnection();
    return await connection.ExecuteScalarAsync<int?>(new CommandDefinition(
            sql,
            new
            {
                UserId = userId
            },
            cancellationToken: cancellationToken));
}
}