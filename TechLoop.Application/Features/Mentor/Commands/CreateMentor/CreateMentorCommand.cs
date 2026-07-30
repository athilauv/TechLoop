using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;

namespace TechLoop.Application.Features.Mentor.Commands.CreateMentor;

public sealed record CreateMentorCommand(string Username, string Email, int TechnologyId ) : IRequest<CreateMentorResponse>;