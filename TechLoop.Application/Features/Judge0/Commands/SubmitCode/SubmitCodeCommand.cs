using MediatR;
using TechLoop.Application.Feature.Judge0.DTOs;

namespace TechLoop.Application.Judge0.Commands.SubmitCode;

public sealed record SubmitCodeCommand(Judge0SubmissionRequest Request ) : IRequest<Judge0SubmissionResponse?>;