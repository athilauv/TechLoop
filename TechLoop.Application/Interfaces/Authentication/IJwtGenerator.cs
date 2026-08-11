using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Authentication;

public interface IJwtGenerator
{
    string GenerateAccessToken(User user);

    string GenerateRefreshToken();

    string GeneratePasswordResetToken(User user);

    Guid? ValidatePasswordResetToken(string token);
}