using MediatR;
using TechLoop.Application.Feature.Judge0.DTOs;

namespace TechLoop.Application.Judge0.Commands.RunCode;

public sealed record RunCodeCommand(RunCodeRequest Request) : IRequest<Judge0SubmissionResponse?>;
