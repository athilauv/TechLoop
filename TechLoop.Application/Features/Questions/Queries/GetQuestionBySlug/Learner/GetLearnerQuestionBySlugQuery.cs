using MediatR;
using TechLoop.Application.Features.Questions.DTOs;

namespace TechLoop.Application.Features.Questions.Queries.GetQuestionBySlug.Learner;

public sealed record GetLearnerQuestionBySlugQuery(string Slug) : IRequest<LearnerQuestionResponse>;
