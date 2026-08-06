using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Discussions.Commands.CreateDiscussion;
using TechLoop.Application.Features.Discussions.Commands.DeleteDiscussion;
using TechLoop.Application.Features.Discussions.Commands.UpdateDiscussion;
using TechLoop.Application.Features.Discussions.Queries.GetDiscussionById;
using TechLoop.Application.Features.Discussions.Queries.GetDiscussions;
using TechLoop.Application.Features.Discussions.Queries.GetQuestionDiscussions;

namespace TechLoop.API.Controllers.Learner;

[ApiController]
[Authorize(Roles = "Learner")]
[Route("api/learner/discussions")]
public sealed class DiscussionsController : ControllerBase
{
    private readonly IMediator _mediator;
    public DiscussionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Creates a new discussion.
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateDiscussionCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }
    
    // Returns a discussion by id.
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(
            new GetDiscussionByIdQuery(id));

        return Ok(result);
    }

    // Returns all discussions.
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(
            new GetDiscussionsQuery());

        return Ok(result);
    }

    // Returns discussions for a question.
    [HttpGet("question/{questionId:int}")]
    public async Task<IActionResult> GetByQuestion(
        int questionId)
    {
        var result = await _mediator.Send(
            new GetQuestionDiscussionsQuery(questionId));

        return Ok(result);
    }
    
    // Updates a discussion.
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdatedDiscussionCommand command)
    {
        if (id != command.Id)
            return BadRequest("Route id and request id do not match.");

        var result = await _mediator.Send(command);

        return Ok(result);
    }

    // Deletes a discussion.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(
            new DeleteDiscussionCommand(id));

        return NoContent();
    }
}