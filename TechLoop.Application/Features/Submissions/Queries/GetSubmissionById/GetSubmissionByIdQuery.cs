using MediatR;
using TechLoop.Application.Features.Submissions.DTOs;

namespace TechLoop.Application.Features.Submissions.Queries.GetSubmissionById;

public sealed record GetSubmissionByIdQuery(int Id ) : IRequest<SubmissionResponse?>;