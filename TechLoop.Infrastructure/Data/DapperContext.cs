using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Domain.Enums;

namespace TechLoop.Infrastructure.Data;

public class DapperContext : IDapperContext
{
    private readonly NpgsqlDataSource _dataSource;
    public DapperContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")!;
        var builder = new NpgsqlDataSourceBuilder(connectionString);
        _dataSource = builder.Build();
    }

    public IDbConnection CreateConnection()
    {
        return _dataSource.OpenConnection();
    }
}