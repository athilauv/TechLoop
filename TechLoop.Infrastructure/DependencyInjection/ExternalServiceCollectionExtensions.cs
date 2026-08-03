using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Infrastructure.Configuration;
using TechLoop.Infrastructure.Services;

namespace TechLoop.Infrastructure.DependencyInjection;

public static class ExternalServiceCollectionExtensions
{
    public static IServiceCollection AddExternalServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<EmailSettings>(
            configuration.GetSection("EmailSettings"));

        services.AddScoped<IEmailService, EmailService>();

        services.AddHttpClient<IJudge0Service, Judge0Service>(client =>
        {
            client.BaseAddress =
                new Uri(configuration["Judge0:BaseUrl"]!);
        });

        return services;
    }
}