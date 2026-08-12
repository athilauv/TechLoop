using System.Text;
using Dapper;
using TechLoop.Api.Middleware;
using TechLoop.Application;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Infrastructure.Authentication;
using TechLoop.Application.Services;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using TechLoop.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine("Connection");
Console.WriteLine(builder.Configuration.GetConnectionString("DefaultConnection"));

foreach (var kv in builder.Configuration.AsEnumerable())
{
    if (kv.Key.Contains("Connection", StringComparison.OrdinalIgnoreCase))
    {
        Console.WriteLine($"{kv.Key} = {kv.Value}");
    }
}
DefaultTypeMap.MatchNamesWithUnderscores = true;

// Controllers
builder.Services.AddControllers();

// Application -
builder.Services.AddApplication();

//validation
builder.Services.AddFluentValidationAutoValidation();

// Infrastructure
builder.Services.AddHttpContextAccessor();
builder.Services.AddInfrastructure(builder.Configuration);

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Authorization
builder.Services.AddAuthorization(options =>
{ 
    options.AddPolicy("MentorOnly", policy =>
    {
        policy.RequireRole("Mentor");
    });
});

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"];

if (string.IsNullOrWhiteSpace(jwtSecret))
{
    throw new Exception("JWT Secret is missing.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSecret)),

                RoleClaimType = ClaimTypes.Role,
                NameClaimType = ClaimTypes.NameIdentifier,

                ClockSkew = TimeSpan.FromMinutes(1)
            };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                Console.WriteLine(
                    $"Authorization Header: {context.Request.Headers.Authorization}"
                );

                if (string.IsNullOrEmpty(context.Token))
                {
                    context.Token =
                        context.Request.Cookies["accessToken"];
                }

                Console.WriteLine(
                    $"Access Token From Cookie: {!string.IsNullOrEmpty(context.Token)}"
                );

                return Task.CompletedTask;
            },

            OnAuthenticationFailed = context =>
            {
                Console.WriteLine(
                    $"JWT Authentication Failed: {context.Exception.Message}"
                );

                return Task.CompletedTask;
            },

            OnTokenValidated = context =>
            {
                Console.WriteLine(
                    "JWT Token Validated Successfully"
                );

                Console.WriteLine(
                    $"User: {context.Principal?.Identity?.Name}"
                );

                Console.WriteLine($"NameIdentifier: {context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value}");

                return Task.CompletedTask;
            },

            OnChallenge = context =>
            {
                Console.WriteLine($"JWT Challenge: {context.Error}");
                Console.WriteLine($"JWT Error Description: {context.ErrorDescription}");
                return Task.CompletedTask;
            }
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (string.IsNullOrEmpty(context.Token))
                {
                    context.Token = context.Request.Cookies["accessToken"];
                }

                return Task.CompletedTask;
            }
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("React", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Rate Limiter
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("login", config =>
    {
        config.PermitLimit = 5;
        config.Window = TimeSpan.FromMinutes(5);
        config.QueueLimit = 0;
    });
});

// Build
var app = builder.Build();

//swagger
app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.RoutePrefix = "swagger";
});


// middleware
app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("React");

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();