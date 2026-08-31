using Microsoft.Extensions.DependencyInjection;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Infrastructure.Authentication;
using TechLoop.Application.Services;

namespace TechLoop.Infrastructure.DependencyInjection;

public static class AuthenticationServiceCollectionExtensions
{
    public static IServiceCollection AddAuthenticationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IJwtGenerator, JwtTokenGenerator>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        
        return services;
    }
}