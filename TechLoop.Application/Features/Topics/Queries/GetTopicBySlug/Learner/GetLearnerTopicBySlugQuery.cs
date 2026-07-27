using MediatR;
using TechLoop.Application.Features.Topics.DTOs;

namespace TechLoop.Application.Features.Topics.Queries.GetTopicBySlug.Learner;

public sealed record GetLearnerTopicBySlugQuery(string Slug) : IRequest<LearnerTopicResponse>;