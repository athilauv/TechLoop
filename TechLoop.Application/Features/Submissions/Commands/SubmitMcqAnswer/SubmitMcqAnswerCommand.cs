using MediatR;
using TechLoop.Application.Features.Submissions.DTOs;

namespace TechLoop.Application.Features.Submissions.Commands.SubmitMcqAnswer;

public sealed record SubmitMcqAnswerCommand(
    Guid UserId,
    SubmitMcqAnswerRequest Request)
    : IRequest<SubmitMcqAnswerResponse>;