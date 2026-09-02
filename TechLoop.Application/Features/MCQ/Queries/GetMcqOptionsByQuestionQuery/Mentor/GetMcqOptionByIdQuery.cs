using MediatR;
using TechLoop.Application.Features.MCQ.DTOs;

namespace TechLoop.Application.Features.MCQ.Queries.GetMcqOptionsByQuestionQuery.Mentor;

public sealed record GetMcqOptionByIdQuery(int QuestionId)
    : IRequest<IEnumerable<MentorMcqOptionResponse>>;
