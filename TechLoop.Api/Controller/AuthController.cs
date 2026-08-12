using MediatR;
using Microsoft.AspNetCore.Authorization;
using TechLoop.Application.DTOs.Auth;
using TechLoop.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TechLoop.Application.Features.Mentor.Commands.UpdateProfile;
using TechLoop.Application.Features.Mentor.DTOs;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IMediator _mediator;

    public AuthController(IAuthService authService, IMediator mediator)
    {
        _authService = authService;
        _mediator = mediator;
    }

    [EnableRateLimiting("login")]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        SetAuthCookies(response);
        return Ok(new
        {
            response.Message
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        return Created("", response);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var response = await _authService.RefreshTokenAsync(Request.Cookies["refreshToken"]);
        SetAuthCookies(response);

        return Ok(new
        {
            response.Message
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        await _authService.LogoutAsync(refreshToken);
        DeleteAuthCookies();
        return Ok(new
        {
            Message = "Logged out successfully."
        });
    }

    private void SetAuthCookies(AuthResponse response)
    {
        Console.WriteLine($"Access Token Empty: {string.IsNullOrWhiteSpace(response.AccessToken)}");
        Console.WriteLine($"Refresh Token Empty: {string.IsNullOrWhiteSpace(response.RefreshToken)}");
        Response.Cookies.Append("accessToken", response.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(15)
        });

        Response.Cookies.Append("refreshToken", response.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(8)
        });
    }

    private void DeleteAuthCookies()
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax
        };

        Response.Cookies.Delete("accessToken", options);
        Response.Cookies.Delete("refreshToken", options);
    }

    // Update mentor profile
    [HttpPut("update-profile/{email}")]
    public async Task<IActionResult> UpdateProfile(string email,
        [FromBody] UpdateMentorProfileRequest request)
    {
        var command = new UpdateProfileCommand(
            email,
            request.Password,
            request.ConfirmPassword,
            request.PhoneNumber,
            request.Bio,
            request.LinkedInUrl,
            request.GithubUrl,
            request.ProfileImageUrl);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // Change password - authenticated users only
    [Authorize]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        await _authService.ChangePasswordAsync(request);
        DeleteAuthCookies();
        return Ok(new
        {
            Message = "Password changed successfully. Please sign in again."
        });
    }

    // Forgot password - public
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        await _authService.ForgotPasswordAsync(request);
        return Ok(new
        {
            Message =
                "If an account exists with this email, a password reset link has been sent."
        });
    }

    // Reset password - public, reset token required
    [HttpPut("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        await _authService.ResetPasswordAsync(request);
        return Ok(new
        {
            Message = "Password reset successfully. Please sign in again."
        });
    }
}