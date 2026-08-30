using MediatR;
using TechLoop.Application.Features.Questions.DTOs;

namespace TechLoop.Application.Features.Questions.Queries.GetQuestionBySlug.Mentor;

public sealed record GetMentorQuestionBySlugQuery(string Slug) : IRequest<MentorQuestionResponse>;
