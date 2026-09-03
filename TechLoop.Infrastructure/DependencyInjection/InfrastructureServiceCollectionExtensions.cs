using Microsoft.Extensions.DependencyInjection;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Interfaces;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Infrastructure.Caching;
using TechLoop.Infrastructure.Data;

namespace TechLoop.Infrastructure.DependencyInjection;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddMemoryCache();

        services.AddScoped<IDapperContext, DapperContext>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddSingleton<ICacheService, MemoryCacheService>();

        return services;
    }
}
