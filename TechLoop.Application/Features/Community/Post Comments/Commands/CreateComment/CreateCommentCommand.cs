using MediatR;
using TechLoop.Application.Features.Community.PostComments.DTOs;

namespace TechLoop.Application.Features.Community.PostComments.Commands.CreateComment;

public sealed class CreateCommentCommand : IRequest<PostCommentDto>
{
    public int PostId { get; set; }
    public int? ParentCommentId { get; set; }
    public string Content { get; set; } = string.Empty;
}