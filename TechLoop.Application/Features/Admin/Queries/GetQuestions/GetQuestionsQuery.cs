using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Admin.DTOs;

namespace TechLoop.Application.Features.Admin.Queries.GetQuestions;

public sealed record GetQuestionsQuery(
    int Page = 1, int PageSize = 20, short? QuestionType = null, short? Difficulty = null,
    int? SubTopicId = null, string? Search = null, bool? Published = null, string? Sort = "position-asc")
    : IRequest<PagedResult<AdminQuestionResponse>>;
