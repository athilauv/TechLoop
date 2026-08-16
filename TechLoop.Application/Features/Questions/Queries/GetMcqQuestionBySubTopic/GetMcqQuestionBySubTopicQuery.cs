using MediatR;
using TechLoop.Application.Features.Questions.DTOs;

namespace TechLoop.Application.Features.Questions.Queries.GetMcqQuestionBySubTopic;

public sealed record GetMcqQuestionBySubTopicQuery(
    int SubTopicId
) : IRequest<LearnerMcqQuestionResponse?>;