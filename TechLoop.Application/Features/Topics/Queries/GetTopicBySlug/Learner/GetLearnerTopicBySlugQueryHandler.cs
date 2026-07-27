using MediatR;
using TechLoop.Application.Features.Topics.DTOs;

namespace TechLoop.Application.Features.Topics.Queries.GetTopicById.Learner;

public sealed record GetLearnerTopicBySlugQuery(int Id ) : IRequest<LearnerTopicResponse>;