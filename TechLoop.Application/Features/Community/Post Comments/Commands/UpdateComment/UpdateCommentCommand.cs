using MediatR;
using TechLoop.Application.Features.Community.PostComments.DTOs;

namespace TechLoop.Application.Features.Community.PostComments.Commands.UpdateComment;

public sealed class UpdateCommentCommand : IRequest<PostCommentDto>
{
    public int Id { get; set; }

    public string Content { get; set; } = string.Empty;
}
