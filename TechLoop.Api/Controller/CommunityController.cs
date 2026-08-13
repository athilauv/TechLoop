using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.API.Contracts.Discussions;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.CreatePost;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.DeletePost;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.UpdatePost;
using TechLoop.Application.Features.Community.CommunityPosts.Queries.GetFeed;
using TechLoop.Application.Features.Community.CommunityPosts.Queries.GetPostById;
using TechLoop.Application.Features.Community.PostComments.Commands.CreateComment;
using TechLoop.Application.Features.Community.PostComments.Commands.DeleteComment;
using TechLoop.Application.Features.Community.PostComments.Commands.UpdateComment;
using TechLoop.Application.Features.Community.PostComments.Queries.GetCommentById;
using TechLoop.Application.Features.Community.PostComments.Queries.GetPostComments;
using TechLoop.Application.Features.Community.PostLikes.Commands.LikePost;
using TechLoop.Application.Features.Community.PostLikes.Commands.UnlikePost;
using TechLoop.Application.Features.Community.PostLikes.Queries.GetPostLikeStatus;
using TechLoop.Application.Features.Community.SavedPosts.Commands.SavePost;
using TechLoop.Application.Features.Community.SavedPosts.Commands.UnsavePost;
using TechLoop.Application.Features.Community.SavedPosts.Queries.GetSavedPosts;

namespace TechLoop.Api.Controllers.Learner;

[ApiController]
[Authorize(Roles = "Learner")]
[Route("api/learner/community")]
public sealed class CommunityController : ControllerBase
{
    private readonly IMediator _mediator;

    public CommunityController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("posts")]
    public async Task<IActionResult> GetFeed()
    {
        var result = await _mediator.Send(new GetFeedQuery());
        return Ok(result);
    }

    [HttpGet("posts/{postId:int}")]
    public async Task<IActionResult> GetPostById(int postId)
    {
        var result = await _mediator.Send(new GetPostByIdQuery(postId));
        return Ok(result);
    }

    [HttpPost("posts")]
    public async Task<IActionResult> Create([FromBody] CreatePostCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("posts/{postId:int}")]
    public async Task<IActionResult> Update(int postId, [FromBody] UpdatePostCommand command)
    {
        command.Id = postId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("posts/{postId:int}")]
    public async Task<IActionResult> Delete(int postId)
    {
        await _mediator.Send(new DeletePostCommand(postId));
        return NoContent();
    }

    [HttpPost("posts/{postId:int}/comments")]
    public async Task<IActionResult> CreateComment(int postId, [FromBody] CreateCommentRequest request)
    {
        var command = new CreateCommentCommand
        {
            PostId = postId,
            ParentCommentId = request.ParentCommentId,
            Content = request.Content
        };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
    

    [HttpGet("posts/{postId:int}/comments")]
    public async Task<IActionResult> GetPostComments(int postId)
    {
        var result = await _mediator.Send(new GetPostCommentsQuery(postId));
        return Ok(result);
    }

    [HttpGet("comments/{commentId:int}")]
    public async Task<IActionResult> GetCommentById(int commentId)
    {
        var result = await _mediator.Send(new GetCommentByIdQuery(commentId));
        return Ok(result);
    }

    [HttpPut("comments/{commentId:int}")]
    public async Task<IActionResult> UpdateComment(int commentId,
        [FromBody] UpdateCommentCommand command)
    {
        command.Id = commentId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("comments/{commentId:int}")]
    public async Task<IActionResult> DeleteComment(int commentId)
    {
        await _mediator.Send(new DeleteCommentCommand(commentId));
        return NoContent();
    }

    [HttpPost("posts/{postId:int}/likes")]
    public async Task<IActionResult> LikePost(int postId)
    {
        var result = await _mediator.Send(new LikePostCommand(postId));
        return Ok(result);
    }

    [HttpDelete("posts/{postId:int}/likes")]
    public async Task<IActionResult> UnlikePost(int postId)
    {
        var result = await _mediator.Send(new UnlikePostCommand(postId));
        return Ok(result);
    }

    [HttpGet("posts/{postId:int}/likes/me")]
    public async Task<IActionResult> GetLikeStatus(int postId)
    {
        var result = await _mediator.Send(new GetPostLikeStatusQuery(postId));
        return Ok(result);
    }

    [HttpPost("posts/{postId:int}/save")]
    public async Task<IActionResult> SavePost(int postId)
    {
        var result = await _mediator.Send(new SavePostCommand(postId));
        return Ok(result);
    }

    [HttpDelete("posts/{postId:int}/save")]
    public async Task<IActionResult> UnsavePost(int postId)
    {
        var result = await _mediator.Send(new UnsavePostCommand(postId));
        return Ok(result);
    }

    [HttpGet("saved-posts")]
    public async Task<IActionResult> GetSavedPosts()
    {
        var result = await _mediator.Send(new GetSavedPostsQuery());
        return Ok(result);
    }
}