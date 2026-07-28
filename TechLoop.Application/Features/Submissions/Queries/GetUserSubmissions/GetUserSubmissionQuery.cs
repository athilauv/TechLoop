using MediatR;
using TechLoop.Application.Features.Submissions.DTOs;

namespace TechLoop.Application.Features.Submissions.Queries.GetUserSubmissions;

public sealed record GetUserSubmissionsQuery(Guid UserId ) : IRequest<IEnumerable<SubmissionResponse>>;