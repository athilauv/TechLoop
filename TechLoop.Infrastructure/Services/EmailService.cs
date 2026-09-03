using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Infrastructure.Configuration;

namespace TechLoop.Infrastructure.Services;

public sealed class EmailService : IEmailService
{
    private readonly EmailSettings _settings;
    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    // Mentor invitation
    public async Task SendMentorInvitationAsync(
        string mentorName,
        string email,
        string invitationToken)
    {
        var subject = "Mentor Invitation";

        // The caller provides the JWT token. The email service is responsible
        // for turning it into the actual frontend setup URL.
        var frontendBaseUrl = _settings.FrontendBaseUrl?.TrimEnd('/');

        if (string.IsNullOrWhiteSpace(frontendBaseUrl))
            throw new InvalidOperationException(
                "EmailSettings:FrontendBaseUrl is not configured.");

        var invitationLink =
            $"{frontendBaseUrl}/mentor/setup?token={Uri.EscapeDataString(invitationToken)}";

        var safeMentorName = WebUtility.HtmlEncode(mentorName);
        var safeInvitationLink = WebUtility.HtmlEncode(invitationLink);

        var htmlBody = $"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937;">
                <p>Hi {safeMentorName},</p>

                <p>You have been invited to join <strong>TechLoop</strong> as a Mentor.</p>

                <p>Click the button below to set your password and complete your mentor account setup.</p>

                <p>
                    <a href="{safeInvitationLink}"
                       style="display:inline-block;padding:12px 20px;background:#00E8C2;color:#081423;text-decoration:none;border-radius:8px;font-weight:600;">
                        Set Your Password
                    </a>
                </p>

                <p>
                    If the button does not work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;">
                    <a href="{safeInvitationLink}">{safeInvitationLink}</a>
                </p>

                <p>If you didn't expect this email, you can ignore it.</p>

                <p>
                    Regards,<br />
                    TechLoop Team
                </p>
            </body>
            </html>
            """;

        var plainTextBody = $"""
            Hi {mentorName},

            You have been invited to join TechLoop as a Mentor.

            Click the link below to set your password and complete your mentor account setup:

            {invitationLink}

            If you didn't expect this email, you can ignore it.

            Regards,
            TechLoop Team
            """;

        await SendEmailAsync(
            email,
            subject,
            plainTextBody,
            htmlBody);
    }

    // Password reset - common for all users
    public async Task SendPasswordResetAsync(
        string username,
        string email,
        string resetLink)
    {
        var subject = "Reset Password";

        var safeUsername = WebUtility.HtmlEncode(username);
        var safeResetLink = WebUtility.HtmlEncode(resetLink);

        var htmlBody = $"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937;">
                <p>Hi {safeUsername},</p>

                <p>Click the button below to reset your password.</p>

                <p>
                    <a href="{safeResetLink}"
                       style="display:inline-block;padding:12px 20px;background:#00E8C2;color:#081423;text-decoration:none;border-radius:8px;font-weight:600;">
                        Reset Password
                    </a>
                </p>

                <p>
                    If the button does not work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;">
                    <a href="{safeResetLink}">{safeResetLink}</a>
                </p>

                <p>
                    Regards,<br />
                    TechLoop Team
                </p>
            </body>
            </html>
            """;

        var plainTextBody = $"""
            Hi {username},

            Click the link below to reset your password:

            {resetLink}

            Regards,
            TechLoop Team
            """;

        await SendEmailAsync(
            email,
            subject,
            plainTextBody,
            htmlBody);
    }

    private async Task SendEmailAsync(
        string to,
        string subject,
        string plainTextBody,
        string htmlBody)
    {
        using var message = new MailMessage
        {
            From = new MailAddress(
                _settings.SenderEmail,
                _settings.SenderName),

            Subject = subject,
            Body = plainTextBody,
            IsBodyHtml = false
        };

        message.To.Add(to);

        // Send both plain-text and HTML versions so mail clients can
        // render a clickable button/link when HTML is supported.
        message.AlternateViews.Add(
            AlternateView.CreateAlternateViewFromString(
                plainTextBody,
                null,
                "text/plain"));

        message.AlternateViews.Add(
            AlternateView.CreateAlternateViewFromString(
                htmlBody,
                null,
                "text/html"));

        using var client = new SmtpClient(
            _settings.Host,
            _settings.Port)
        {
            Credentials = new NetworkCredential(
                _settings.Username,
                _settings.Password),

            EnableSsl = _settings.EnableSsl
        };

        await client.SendMailAsync(message);
    }
}
