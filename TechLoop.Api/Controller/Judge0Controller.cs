using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Judge0.Commands.RunCode;
using TechLoop.Application.Judge0.Commands.SubmitCode;
using TechLoop.Application.Judge0.Queries.GetSubmissionResult;

namespace TechLoop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/judge0")]
public sealed class Judge0Controller : ControllerBase
{
    private readonly IMediator _mediator;

    public Judge0Controller(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    // Execute learner code for a published coding question.
    [HttpPost("run")]
    [ProducesResponseType(typeof(Judge0ResultResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Run([FromBody] RunCodeRequest request, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new RunCodeCommand(request), cancellationToken);
        if (result is null)
            return BadRequest("Unable to execute code.");

        return Ok(result);
    }
    
    // Submit source code directly to Judge0.
    // Prefer /run for question solving because it validates the
    // published question and its coding template
    [HttpPost("submit")]
    [ProducesResponseType(typeof(Judge0SubmissionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Submit([FromBody] SubmitCodeCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        if (result is null)
            return BadRequest("Unable to submit code to Judge0.");

        return Ok(result);
    }

    // Get an execution result by Judge0 token.
    [HttpGet("result/{token}")]
    [ProducesResponseType(typeof(Judge0ResultResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetResult(string token, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(token))
            return BadRequest("Token is required.");

        var result = await _mediator.Send(new GetSubmissionResultQuery(token), cancellationToken);
        if (result is null)
            return NotFound("Submission not found.");

        return Ok(result);
    }
}
