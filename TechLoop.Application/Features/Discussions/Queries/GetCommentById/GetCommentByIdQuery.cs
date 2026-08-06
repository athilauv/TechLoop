using MediatR;
using TechLoop.Application.Features.Discussions.DTOs;

namespace TechLoop.Application.Features.Discussions.Queries.GetCommentById;

public sealed record GetCommentByIdQuery(int Id) : IRequest<DiscussionCommentDto>;