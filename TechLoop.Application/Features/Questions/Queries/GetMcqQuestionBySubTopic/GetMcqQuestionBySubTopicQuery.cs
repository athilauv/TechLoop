using MediatR;
using TechLoop.Application.Features.MCQ.DTOs;

namespace TechLoop.Application.Features.Questions.Queries.GetMcqQuestionBySubTopic;

public sealed record GetMcqQuestionBySubTopicQuery(
    int SubTopicId
) : IRequest<IReadOnlyList<LearnerMcqQuestionResponse>>;
