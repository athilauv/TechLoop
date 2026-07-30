namespace TechLoop.Application.Interfaces.Infrastructure;

public interface IEmailService
{
    Task SendMentorInvitationAsync(string mentorName, string email, string invitationLink);
    Task SendPasswordResetAsync(string mentorName, string email, string resetLink);
}