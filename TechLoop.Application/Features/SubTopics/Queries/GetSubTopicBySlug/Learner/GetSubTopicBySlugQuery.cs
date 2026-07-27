using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;

namespace TechLoop.Application.Features.SubTopics.Queries.GetSubTopicById.Learner;

public sealed record GetLearnerSubTopicByIdQuery(int Id ) : IRequest<LearnerSubTopicResponse>;