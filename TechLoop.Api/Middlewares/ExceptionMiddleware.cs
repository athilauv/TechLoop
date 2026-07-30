using System.Text.Json;
using TechLoop.Application.DTOs.Common;
using TechLoop.Application.Common.Exceptions;

namespace TechLoop.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch(BadRequestException e){
            await HandleException( context, 400, e.Message);
        }
        catch(UnauthorizedException e){
            await HandleException(context, 401, e.Message);
        }
        catch(NotFoundException e){
            await HandleException(context, 404, e.Message);
        }
        catch (Judge0Exception e)
        {
            await HandleException(context, 502, e.Message);
        }
        catch(Exception ex){
            await HandleException(context , 500, ex.Message);
        }
        
    }
    private static async Task HandleException(
        HttpContext context,
        int statusCode,
        string message){
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        
        var response = new ErrorResponse
        {
            Success = false,
            Message = message
        };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}