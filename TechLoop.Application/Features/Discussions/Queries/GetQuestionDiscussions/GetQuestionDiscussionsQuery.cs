using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;

namespace TechLoop.Application.Features.Discussions.Queries.GetQuestionDiscussions;

public sealed record GetQuestionDiscussionsQuery(int QuestionId ) : IRequest<IEnumerable<DiscussionDto>>;