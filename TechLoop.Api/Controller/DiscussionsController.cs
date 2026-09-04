using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.API.Contracts.Discussions;
using TechLoop.Application.Features.DiscussionComments.Commands.CreateComment;
using TechLoop.Application.Features.Discussions.Commands.CreateDiscussion;
using TechLoop.Application.Features.Discussions.Commands.DeleteComment;
using TechLoop.Application.Features.Discussions.Commands.DeleteDiscussion;
using TechLoop.Application.Features.Discussions.Commands.UpdateComment;
using TechLoop.Application.Features.Discussions.Commands.UpdateDiscussion;
using TechLoop.Application.Features.Discussions.Queries.GetCommentById;
using TechLoop.Application.Features.Discussions.Queries.GetDiscussionById;
using TechLoop.Application.Features.Discussions.Queries.GetDiscussionComments;
using TechLoop.Application.Features.Discussions.Queries.GetDiscussions;
using TechLoop.Application.Features.Discussions.Queries.GetQuestionDiscussions;

namespace TechLoop.API.Controllers.Learner;

[ApiController]
[Authorize(Roles = "Learner,Mentor")]
[Route("api/discussions")]
public sealed class DiscussionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DiscussionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Creates a new discussion.
    [HttpPost]
    public async Task<IActionResult> CreateDiscussion(
        [FromBody] CreateDiscussionCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetDiscussionById),
            new { id = result.Id },
            result);
    }

    // Returns a discussion by id.
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDiscussionById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetDiscussionByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    // Returns all discussions.
    [HttpGet]
    public async Task<IActionResult> GetAllDiscussions([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null, [FromQuery] string? sort = "newest", CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetDiscussionsQuery(page, pageSize, search, sort), cancellationToken);
        return Ok(result);
    }

    // Returns discussions for a question.
    [HttpGet("question/{questionId:int}")]
    public async Task<IActionResult> GetQuestionDiscussions(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetQuestionDiscussionsQuery(questionId), cancellationToken);
        return Ok(result);
    }

    // Updates a discussion.
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateDiscussion(
        int id, [FromBody] UpdatedDiscussionCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest("Route id and request id do not match.");
        }

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    // Deletes a discussion.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDiscussion(int id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteDiscussionCommand(id), cancellationToken);
        return NoContent();
    }

    //create comment
    [HttpPost("{discussionId:int}/comments")]
    public async Task<IActionResult> CreateComment(int discussionId, [FromBody] CreateCommentRequest request)
    {
        var command = new CreateCommentCommand(discussionId, request.ParentCommentId, request.Content);
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCommentById), new { id = result.Id }, result);
    }

    // Returns a comment by id.
    [HttpGet("comments/{id:int}")]
    public async Task<IActionResult> GetCommentById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCommentByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    // Returns all comments for a discussion.
    [HttpGet("{discussionId:int}/comments")]
    public async Task<IActionResult> GetDiscussionComments(int discussionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetDiscussionCommentsQuery(discussionId), cancellationToken);
        return Ok(result);
    }

    // Updates a comment.
    [HttpPut("comments/{id:int}")]
    public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentRequest request)
    {
        var command = new UpdateCommentCommand(id, request.Content);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // Deletes a comment.
    [HttpDelete("comments/{id:int}")]
    public async Task<IActionResult> DeleteComment(int id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteCommentCommand(id), cancellationToken);
        return NoContent();
    }
}