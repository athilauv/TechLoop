using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TechLoop.Application.DTOs.Auth;
using TechLoop.Application.Features.Mentor.Commands.UpdateProfile;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuthService _authService;
    private readonly IMediator _mediator;

    public AuthController(IAuthService authService, IMediator mediator, ICurrentUserService currentUserService)
    {
        _authService = authService;
        _mediator = mediator;
        _currentUserService = currentUserService;
    }

   // LOGIN
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

    // REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        return Created("", response);
    }

  // REFRESH TOKEN
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var response = await _authService.RefreshTokenAsync(refreshToken);
        SetAuthCookies(response);
        return Ok(new
        {
            response.Message
        });
    }

   // LOGOUT
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

   // CURRENT USER
    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        return Ok(new
        {
            UserId = _currentUserService.UserId,
            RoleId = (int)_currentUserService.Role,
            Role = _currentUserService.Role.ToString()
        });
    }

   // AUTH COOKIES
    private void SetAuthCookies(AuthResponse response)
    {
        Console.WriteLine($"Access Token Empty: {string.IsNullOrWhiteSpace(response.AccessToken)}");
        Console.WriteLine($"Refresh Token Empty: {string.IsNullOrWhiteSpace(response.RefreshToken)}");

        Response.Cookies.Append("accessToken", response.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });

        Response.Cookies.Append("refreshToken", response.RefreshToken,
            new CookieOptions
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

    // MENTOR INITIAL SETUP
    [HttpPut("mentor-setup")]
    public async Task<IActionResult> MentorSetup(
        [FromQuery] string token,
        [FromBody] UpdateMentorProfileRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateProfileCommand(
            token,
            request.Password,
            request.ConfirmPassword,
            request.PhoneNumber,
            request.Bio,
            request.LinkedInUrl,
            request.GithubUrl,
            request.ProfileImageUrl);

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

   // CHANGE PASSWORD
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

      // FORGOT PASSWORD
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        await _authService.ForgotPasswordAsync(request);
        return Ok(new
        {
            Message = "If an account exists with this email, a password reset link has been sent."
        });
    }

    // RESET PASSWORD\
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