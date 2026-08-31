using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechLoop.Application.Features.Submissions.Commands.CreateSubmission;
using TechLoop.Application.Features.Submissions.Commands.SubmitMcqAnswer;
using TechLoop.Application.Features.Submissions.Commands.UpdateSubmissionResult;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Features.Submissions.Queries.GetQuestionSubmissions;
using TechLoop.Application.Features.Submissions.Queries.GetSubmissionById;
using TechLoop.Application.Features.Submissions.Queries.GetUserSubmissions;

namespace TechLoop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/submissions")]
public class SubmissionController : ControllerBase
{
    private readonly IMediator _mediator;
    public SubmissionController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    /// Submit source code.
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateSubmissionRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var command = new CreateSubmissionCommand(userId, request);
        var response = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById),
            new { id = response.Id },
            response);
    }
    
    // Get submission by Id.
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var query = new GetSubmissionByIdQuery(id);
        var response = await _mediator.Send(query, cancellationToken);
        if (response is null)
            return NotFound();
        return Ok(response);
    }
    
    // Get current user's submissions.
    [HttpGet("me")]
    public async Task<IActionResult> GetMySubmissions(CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var query = new GetUserSubmissionsQuery(userId);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }
    
    // Get submissions by question.
    [HttpGet("question/{questionId:int}")]
    public async Task<IActionResult> GetByQuestion(int questionId, CancellationToken cancellationToken)
    {
        var query = new GetQuestionSubmissionsQuery(questionId);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }
    
    [HttpPost("mcq")]
    public async Task<IActionResult> SubmitMcqAnswer([FromBody] SubmitMcqAnswerRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var command = new SubmitMcqAnswerCommand(userId, request);
        var response = await _mediator.Send(command, cancellationToken);
        return Ok(response);
    }
    
   
}