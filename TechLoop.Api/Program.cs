using System.Text;
using Dapper;
using TechLoop.Api.Middleware;
using TechLoop.Application;
using TechLoop.Application.Interfaces;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Application.Validators;
using TechLoop.Infrastructure.Authentication;
using TechLoop.Infrastructure.Data;
using TechLoop.Infrastructure.Repositories;
using TechLoop.Application.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using TechLoop.Infrastructure.Configuration;
using TechLoop.Infrastructure.Services;

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

builder.Services.AddFluentValidationAutoValidation();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Authentication Module 
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IJwtGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

//Authorization
builder.Services.AddAuthorization(options =>
{ 
    options.AddPolicy("MentorOnly", policy =>
    {
        policy.RequireRole("Mentor");
    });
});

// Repositories
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<ITechnologyRepository, TechnologyRepository>();
builder.Services.AddScoped<ITopicsRepository, TopicRepository>();
builder.Services.AddScoped<ISubTopicsRepository, SubTopicsRepository>();
builder.Services.AddScoped<ITechnologyCategoryRepository, TechnologyCategoryRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IMcqOptionRepository, McqOptionRepository>();
builder.Services.AddScoped<ICodingTemplateRepository, CodingTemplateRepository>();
builder.Services.AddScoped<ITestCaseRepository, TestCaseRepository>();
builder.Services.AddScoped<ISubmissionRepository, SubmissionRepository>();
builder.Services.AddScoped<ICurriculumRepository, CurriculumRepository>();
builder.Services.AddScoped<IMentorRepository, MentorRepository>();
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHttpClient<IJudge0Service, Judge0Service>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Judge0:BaseUrl"]!);
});

// Infrastructure
builder.Services.AddScoped<IDapperContext, DapperContext>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

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
                
                RoleClaimType = ClaimTypes.Role
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