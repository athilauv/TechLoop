using MediatR;
using TechLoop.Application.Features.Admin.DTOs;

namespace TechLoop.Application.Features.Admin.Queries.GetQuestions;

public sealed record GetQuestionsQuery : IRequest<IEnumerable<AdminQuestionResponse>>;
