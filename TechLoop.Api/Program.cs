using System.Text;
using Dapper;
using TechLoop.Api.Middleware;
using TechLoop.Application;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using TechLoop.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

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

var emailSender = builder.Configuration["EmailSettings:SenderEmail"];
if (string.IsNullOrWhiteSpace(emailSender))
{
    throw new InvalidOperationException("EmailSettings:SenderEmail is missing. Start the API with the Development environment or configure a valid sender email.");
}

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type =>
        type.FullName?.Replace("+", ".") ?? type.Name);
});

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
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                RoleClaimType = ClaimTypes.Role,
                NameClaimType = ClaimTypes.NameIdentifier,
                ClockSkew = TimeSpan.FromMinutes(1)
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
            .WithOrigins("http://localhost:5174")
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
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseRouting();
app.UseCors("React");
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();