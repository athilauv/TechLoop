using System.Security.Cryptography;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.DTOs.Auth;
using TechLoop.Application.Interfaces.Authentication;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IJwtGenerator _jwtGenerator;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmailService _emailService;

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IJwtGenerator jwtGenerator,
        IPasswordHasher passwordHasher,
        ICurrentUserService currentUserService,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _jwtGenerator = jwtGenerator;
        _passwordHasher = passwordHasher;
        _currentUserService = currentUserService;
        _emailService = emailService;
    }

     // REGISTER
    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        var existingEmail = await _userRepository.GetByEmailAsync(request.Email);
        if (existingEmail != null)
            throw new BadRequestException("Email already exists.");

        var existingUsername = await _userRepository.GetByUsernameAsync(request.Username);
        if (existingUsername != null)
            throw new BadRequestException("Username already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            RoleId = 1,
            FailedLoginAttempts = 0,
            LockedUntil = null,
            LastLoginAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        return new RegisterResponse
        {
            Message = "User registered successfully."
        };
    }

     // LOGIN
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user =
            await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
            throw new NotFoundException("User not found.");

        if (user.LockedUntil.HasValue &&
            user.LockedUntil > DateTime.UtcNow)
        {
            throw new UnauthorizedException($"Account locked until {user.LockedUntil:yyyy-MM-dd HH:mm:ss} UTC");
        }

        var isValidPassword = _passwordHasher.VerifyHashedPassword(request.Password, user.PasswordHash);
        if (!isValidPassword)
        {
            user.FailedLoginAttempts++;
            if (user.FailedLoginAttempts >= 5)
            {
                user.LockedUntil = DateTime.UtcNow.AddMinutes(15);
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateSecurityAsync(user);
            throw new UnauthorizedException("Invalid password.");
        }

        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;
        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateSecurityAsync(user);
        var existingTokens = await _refreshTokenRepository.GetByUserIdAsync(user.Id);
        foreach (var token in existingTokens)
        {
            if (!token.IsRevoked)
            {
                await _refreshTokenRepository.RevokeAsync(token.Id);
            }
        }

        var accessToken = _jwtGenerator.GenerateAccessToken(user);
        var refreshTokenValue = _jwtGenerator.GenerateRefreshToken();
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _refreshTokenRepository.AddAsync(refreshToken);
        return new AuthResponse
        {
            Message = "User logged in successfully.",
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue
        };
    }

    // REFRESH
    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
        if (token == null)
            throw new UnauthorizedException("Invalid refresh token.");

        if (token.IsRevoked)
            throw new UnauthorizedException("Refresh token has been revoked.");

        if (token.ExpiresAt <= DateTime.UtcNow)
            throw new UnauthorizedException("Refresh token has expired.");

        var user = await _userRepository.GetByIdAsync(token.UserId);
        if (user == null)
            throw new NotFoundException("User not found.");

        await _refreshTokenRepository.RevokeAsync(token.Id);
        var accessToken = _jwtGenerator.GenerateAccessToken(user);
        var refreshTokenValue = _jwtGenerator.GenerateRefreshToken();
        await _refreshTokenRepository.AddAsync(
            new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = refreshTokenValue,
                ExpiresAt =
                    DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

        return new AuthResponse
        {
            Message = "Token refreshed successfully.",
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue
        };
    }

    // LOGOUT
    public async Task LogoutAsync(string? refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken)) 
            return;

        var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
        if (token == null)
            return;

        if (token.IsRevoked)
            return;

        await _refreshTokenRepository.RevokeAsync(token.Id);
    }

    // CHANGE PASSWORD
    public async Task ChangePasswordAsync(ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CurrentPassword))
        {
            throw new BadRequestException("Current password is required.");
        }

        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            throw new BadRequestException("New password is required.");
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            throw new BadRequestException("New password and confirm password do not match.");
        }

        if (request.NewPassword.Length < 8)
        {
            throw new BadRequestException("New password must be at least 8 characters long.");
        }

        var userId = _currentUserService.UserId;
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new NotFoundException("User not found.");

        var valid = _passwordHasher.VerifyHashedPassword(request.CurrentPassword, user.PasswordHash);
        if (!valid)
        {
            throw new BadRequestException("Current password is incorrect.");
        }

        if (request.CurrentPassword == request.NewPassword)
        {
            throw new BadRequestException("New password must be different from current password.");
        }

        var newPasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        await _userRepository.UpdatePasswordAsync(user.Id, newPasswordHash, DateTime.UtcNow);
        var tokens = await _refreshTokenRepository.GetByUserIdAsync(user.Id);
        foreach (var token in tokens)
        {
            if (!token.IsRevoked)
            {
                await _refreshTokenRepository.RevokeAsync(token.Id);
            }
        }
    }
    
    // FORGOT PASSWORD
    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            throw new BadRequestException("Email is required.");
        }

        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null) 
            return;
        var resetToken = _jwtGenerator.GeneratePasswordResetToken(user);
        var resetLink = $"http://localhost:5173/reset-password?token={Uri.EscapeDataString(resetToken)}";
        await _emailService.SendPasswordResetAsync(user.Username, user.Email, resetLink);
    }

    // RESET PASSWORD
    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            throw new BadRequestException("Reset token is required.");
        }

        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            throw new BadRequestException("New password is required.");
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            throw new BadRequestException("New password and confirm password do not match.");
        }

        if (request.NewPassword.Length < 8)
        {
            throw new BadRequestException("New password must be at least 8 characters long.");
        }

        var userId = _jwtGenerator.ValidatePasswordResetToken(request.Token);
        if (!userId.HasValue)
        {
            throw new BadRequestException("Invalid or expired reset token.");
        }

        var user = await _userRepository.GetByIdAsync(userId.Value);
        if (user == null)
            throw new NotFoundException("User not found.");
        var newPasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        await _userRepository.UpdatePasswordAsync(user.Id, newPasswordHash, DateTime.UtcNow);

        // Invalidate all existing sessions.
        var tokens = await _refreshTokenRepository
                .GetByUserIdAsync(user.Id);

        foreach (var token in tokens)
        {
            if (!token.IsRevoked)
            {
                await _refreshTokenRepository
                    .RevokeAsync(token.Id);
            }
        }
    }
}