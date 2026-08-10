using MediatR;
using TechLoop.Application.Features.Community.PostComments.DTOs;

namespace TechLoop.Application.Features.Community.PostComments.Queries.GetCommentById;

public sealed record GetCommentByIdQuery(int Id) : IRequest<PostCommentDto>;