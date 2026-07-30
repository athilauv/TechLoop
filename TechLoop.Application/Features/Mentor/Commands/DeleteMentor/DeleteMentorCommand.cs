using MediatR;

namespace TechLoop.Application.Features.Mentor.Commands.DeleteMentor;

public sealed record DeleteMentorCommand(int MentorId ) : IRequest;