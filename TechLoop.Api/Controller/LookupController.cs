using MediatR;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Lookups.DTOs;
using TechLoop.Application.Features.Lookups.Queries.GetDifficultyLevels;
using TechLoop.Application.Features.Lookups.Queries.GetExampleTypes;
using TechLoop.Application.Features.Lookups.Queries.GetQuestionTypes;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("lookups")]
public sealed class LookupController : ControllerBase
{
    private readonly IMediator _mediator;

    public LookupController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("difficulty-levels")]
    public async Task<ActionResult<IEnumerable<LookupOptionResponse>>> GetDifficultyLevels(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetDifficultyLevelsQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("question-types")]
    public async Task<ActionResult<IEnumerable<LookupOptionResponse>>> GetQuestionTypes(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetQuestionTypesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("example-types")]
    public async Task<ActionResult<IEnumerable<LookupOptionResponse>>> GetExampleTypes(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetExampleTypesQuery(), cancellationToken);
        return Ok(result);
    }
}
