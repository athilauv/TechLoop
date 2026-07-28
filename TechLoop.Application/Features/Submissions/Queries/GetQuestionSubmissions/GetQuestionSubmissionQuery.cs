using MediatR;
using TechLoop.Application.Features.Submissions.DTOs;

namespace TechLoop.Application.Features.Submissions.Queries.GetQuestionSubmissions;

public sealed record GetQuestionSubmissionsQuery(int QuestionId ) : IRequest<IEnumerable<SubmissionResponse>>;