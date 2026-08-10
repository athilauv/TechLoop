using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.CreatePost;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.DeletePost;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.UpdatePost;
using TechLoop.Application.Features.Community.CommunityPosts.Queries.GetFeed;
using TechLoop.Application.Features.Community.CommunityPosts.Queries.GetPostById;
using TechLoop.Application.Features.Community.PostComments.Queries.GetPostComments;
using TechLoop.Application.Features.Community.PostComments.Commands.CreateComment;
using TechLoop.Application.Features.Community.PostComments.Commands.UpdateComment;
using TechLoop.Application.Features.Community.PostComments.Commands.DeleteComment;
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
[Route("api/learner/community/posts")]
public sealed class CommunityController : ControllerBase
{
    private readonly IMediator _mediator;

    public CommunityController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Creates a new community post.
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePostCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{postId:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePostCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{postId:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeletePostCommand(id));
        return NoContent();
    }
    
    // Returns all community posts.
    [HttpGet]
    public async Task<IActionResult> GetFeed()
    {
        var result = await _mediator.Send(new GetFeedQuery());
        return Ok(result);
    }

// Returns a community post by id.
    [HttpGet("{postId:int}")]
    public async Task<IActionResult> GetPostById(int id)
    {
        var result = await _mediator.Send(new GetPostByIdQuery(id));
        return Ok(result);
    }
    
    
    // Creates a comment for a post.
    [HttpPost("{postId:int}/comments")]
    public async Task<IActionResult> CreateComment(
        int postId,
        [FromBody] CreateCommentCommand command)
    {
        command.PostId = postId;
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCommentById),
            new { id = result.Id }, result);
    }

// Updates a comment.
    [HttpPut("/api/learner/community/comments/{commentId:int}")] [HttpPut("comments/{id:int}")]
    public async Task<IActionResult> UpdateComment(
        int id,
        [FromBody] UpdateCommentCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

// Deletes a comment.
    [HttpDelete("/api/learner/community/comments/{commentId:int}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        await _mediator.Send(new DeleteCommentCommand(id));
        return NoContent();
    }

// Gets a comment by id.
    [HttpGet("/api/learner/community/comments/{commentId:int}")]
    public async Task<IActionResult> GetCommentById(int id)
    {
        var result = await _mediator.Send(new GetCommentByIdQuery(id));
        return Ok(result);
    }

// Gets all comments for a post.
    [HttpGet("{postId:int}/comments")]
    public async Task<IActionResult> GetPostComments(int postId)
    {
        var result = await _mediator.Send(new GetPostCommentsQuery(postId));
        return Ok(result);
    }
    
    
    // Like a post.
    [HttpPost("{postId:int}/likes")]
    public async Task<IActionResult> LikePost(int postId)
    {
        var result = await _mediator.Send(new LikePostCommand(postId));
        return Ok(result);
    }

// Unlike a post.
    [HttpDelete("{postId:int}/likes")]
    public async Task<IActionResult> UnlikePost(int postId)
    {
        var result = await _mediator.Send(new UnlikePostCommand(postId));
        return Ok(result);
    }
    
    // Returns whether the current user has liked the post.
    [HttpGet("{postId:int}/likes/me")]
    public async Task<IActionResult> GetLikeStatus(int postId)
    {
        var result = await _mediator.Send(new GetPostLikeStatusQuery(postId));
        return Ok(result);
    }
    
    // Save a post.
    [HttpPost("{postId:int}/save")]
    public async Task<IActionResult> SavePost(int postId)
    {
        var result = await _mediator.Send(new SavePostCommand(postId));
        return Ok(result);
    }
    
    // Unsave a post.
    [HttpDelete("{postId:int}/save")]
    public async Task<IActionResult> UnsavePost(int postId)
    {
        var result = await _mediator.Send(new UnsavePostCommand(postId));
        return Ok(result);
    }
    
    // Returns all saved posts of the current learner.
    [HttpGet("/api/learner/community/saved-posts")]
    public async Task<IActionResult> GetSavedPosts()
    {
        var result = await _mediator.Send(new GetSavedPostsQuery());
        return Ok(result);
    }
}