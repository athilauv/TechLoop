using MediatR;
using TechLoop.Application.Features.Questions.DTOs;

namespace TechLoop.Application.Features.Questions.Queries.GetQuestionDetailsBySlug;

public sealed record GetQuestionDetailsBySlugQuery(string Slug) : IRequest<QuestionDetailsResponse>;
