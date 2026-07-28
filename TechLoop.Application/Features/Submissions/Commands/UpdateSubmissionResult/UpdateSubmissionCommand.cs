using MediatR;
using TechLoop.Application.Features.Submissions.DTOs;

namespace TechLoop.Application.Features.Submissions.Commands.UpdateSubmissionResult;

public sealed record UpdateSubmissionCommand(int Id, UpdateSubmissionRequest Request ) : IRequest<UpdateSubmissionResponse>;