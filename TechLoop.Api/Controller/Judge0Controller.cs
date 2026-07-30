using MediatR;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Judge0.Commands.SubmitCode;
using TechLoop.Application.Judge0.Queries.GetSubmissionResult;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("api/judge0")]
public sealed class Judge0Controller : ControllerBase
{
    private readonly IMediator _mediator;

    public Judge0Controller(IMediator mediator)
    {
        _mediator = mediator;
    }


    /// Submit source code to Judge0.
    [HttpPost("submit")]
    [ProducesResponseType(typeof(Judge0SubmissionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Submit(
        [FromBody] SubmitCodeCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        if (result is null)
        {
            return BadRequest("Unable to submit code to Judge0.");
        }

        return Ok(result);
    }


    /// Get execution result from Judge0.
    [HttpGet("result/{token}")]
    [ProducesResponseType(typeof(Judge0ResultResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetResult(string token, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return BadRequest("Token is required.");
        }

        var result = await _mediator.Send(new GetSubmissionResultQuery(token), cancellationToken);
        if (result is null)
        {
            return NotFound("Submission not found.");
        }

        return Ok(result);
    }
    
    [HttpPost("echo")]
    public IActionResult Echo([FromBody] SubmitCodeCommand command)
    {
        return Ok(new
        {
            command.Request.SourceCode,
            command.Request.LanguageId,
            command.Request.StandardInput,
            command.Request.ExpectedOutput
        });
    }
}