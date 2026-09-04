using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Questions.DTOs;

namespace TechLoop.Application.Features.Questions.Queries.GetAllQuestions.Mentor;

public sealed record GetAllMentorQuestionsQuery(
    int Page = 1, int PageSize = 20, int? Difficulty = null, int? SubTopicId = null,
    short? QuestionType = null, string? Search = null, string? Sort = "position-asc")
    : IRequest<PagedResult<MentorQuestionResponse>>;
