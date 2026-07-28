using MediatR;
using TechLoop.Application.Features.Submissions.DTOs;

namespace TechLoop.Application.Features.Submissions.Commands.CreateSubmission;

public sealed record CreateSubmissionCommand(Guid UserId, CreateSubmissionRequest Request ) : IRequest<CreateSubmissionResponse>;