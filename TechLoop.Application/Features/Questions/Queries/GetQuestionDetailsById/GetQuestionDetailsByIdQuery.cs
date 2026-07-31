using MediatR;
using TechLoop.Application.Features.Questions.DTOs;

namespace TechLoop.Application.Features.Questions.Queries.GetQuestionDetailsById;

public sealed record GetQuestionDetailsByIdQuery(int Id) : IRequest<QuestionDetailsResponse>;