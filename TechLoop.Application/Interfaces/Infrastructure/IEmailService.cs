namespace TechLoop.Application.Interfaces.Infrastructure;

public interface IEmailService
{
    Task SendMentorInvitationAsync(string mentorName, string email, string invitationToken);
    Task SendPasswordResetAsync(string username, string email, string resetLink);
}
