using MediatR;
using TechLoop.Application.Features.Questions.DTOs;

namespace TechLoop.Application.Features.Questions.Queries.GetCodingQuestions;

public sealed record GetCodingQuestionsQuery(
    int Page,
    int PageSize,
    int? TechnologyId,
    int? Difficulty,
    int? SubTopicId,
    string? Search,
    string? Sort
) : IRequest<IEnumerable<LearnerCodingQuestionDto>>;