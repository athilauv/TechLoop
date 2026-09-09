using System.Data;
using Npgsql;
using TechLoop.Application.Interfaces.Infrastructure;

namespace TechLoop.Infrastructure.Data;

public sealed class DapperContext : IDapperContext
{
    private readonly NpgsqlDataSource _dataSource;

    public DapperContext(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public IDbConnection CreateConnection()
    {
        return _dataSource.OpenConnection();
    }
}
