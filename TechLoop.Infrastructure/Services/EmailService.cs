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
        string invitationLink)
    {
        var subject = "Mentor Invitation";

        var body = $"""
                    Hi {mentorName},

                    You have been invited to join TechLoop as a Mentor.

                    Click the link below to set your password.

                    {invitationLink}

                    If you didn't expect this email, you can ignore it.

                    Regards,
                    TechLoop Team
                    """;

        await SendEmailAsync(email, subject, body);
    }

    // Password reset - common for all users
    public async Task SendPasswordResetAsync(
        string username,
        string email,
        string resetLink)
    {
        var subject = "Reset Password";

        var body = $"""
                    Hi {username},

                    Click the link below to reset your password.

                    {resetLink}

                    Regards,
                    TechLoop Team
                    """;

        await SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(
        string to,
        string subject,
        string body)
    {
        using var message = new MailMessage
        {
            From = new MailAddress(
                _settings.SenderEmail,
                _settings.SenderName),

            Subject = subject,
            Body = body,
            IsBodyHtml = false
        };

        message.To.Add(to);

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