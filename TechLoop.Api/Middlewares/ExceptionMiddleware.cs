using System.Text.Json;
using FluentValidation;
using Npgsql;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.DTOs.Common;

namespace TechLoop.Api.Middleware;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (FluentValidation.ValidationException exception)
        {
            await HandleExceptionAsync(
                context,
                StatusCodes.Status400BadRequest,
                string.Join(" ", exception.Errors.Select(error => error.ErrorMessage)));
        }
        catch (BadRequestException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status400BadRequest, exception.Message);
        }
        catch (UnauthorizedException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status401Unauthorized, exception.Message);
        }
        catch (ForbiddenException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status403Forbidden, exception.Message);
        }
        catch (NotFoundException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status404NotFound, exception.Message);
        }
        catch (ConflictException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status409Conflict, exception.Message);
        }
        catch (Judge0Exception exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status502BadGateway, exception.Message);
        }
        catch (TechLoop.Application.Common.Exceptions.ValidationException exception)
        {
            await HandleExceptionAsync(context, StatusCodes.Status400BadRequest, exception.Message);
        }
        catch (PostgresException exception)
        {
            _logger.LogError(
                exception,
                "PostgreSQL error {SqlState} for {Method} {Path}",
                exception.SqlState,
                context.Request.Method,
                context.Request.Path);

            await HandlePostgresExceptionAsync(context, exception);
        }
        catch (TimeoutException exception)
        {
            _logger.LogError(
                exception,
                "Timeout for {Method} {Path}",
                context.Request.Method,
                context.Request.Path);

            await HandleExceptionAsync(
                context,
                StatusCodes.Status504GatewayTimeout,
                "The operation timed out. Please try again.");
        }
        catch (ArgumentException exception)
        {
            await HandleExceptionAsync(
                context,
                StatusCodes.Status400BadRequest,
                exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Unhandled exception for {Method} {Path}",
                context.Request.Method,
                context.Request.Path);

            await HandleExceptionAsync(
                context,
                StatusCodes.Status500InternalServerError,
                exception.Message);
        }
    }

    private static async Task HandlePostgresExceptionAsync(
        HttpContext context,
        PostgresException exception)
    {
        var statusCode = exception.SqlState switch
        {
            PostgresErrorCodes.UniqueViolation => StatusCodes.Status409Conflict,
            PostgresErrorCodes.ForeignKeyViolation => StatusCodes.Status409Conflict,
            PostgresErrorCodes.NotNullViolation => StatusCodes.Status400BadRequest,
            PostgresErrorCodes.CheckViolation => StatusCodes.Status400BadRequest,
            PostgresErrorCodes.StringDataRightTruncation => StatusCodes.Status400BadRequest,
            PostgresErrorCodes.InvalidTextRepresentation => StatusCodes.Status400BadRequest,
            "42804" => StatusCodes.Status500InternalServerError,
            _ => StatusCodes.Status500InternalServerError
        };

        var message = exception.ConstraintName switch
        {
            "sub_topics_slug_key" => "A subtopic with this slug already exists. Please use a different slug.",
            "topics_slug_key" => "A topic with this slug already exists. Please use a different slug.",
            _ => exception.Message
        };

        await HandleExceptionAsync(context, statusCode, message);
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        int statusCode,
        string message)
    {
        if (context.Response.HasStarted)
        {
            return;
        }

        context.Response.Clear();
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new ErrorResponse
        {
            Success = false,
            Message = string.IsNullOrWhiteSpace(message)
                ? "An unexpected error occurred."
                : message
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
