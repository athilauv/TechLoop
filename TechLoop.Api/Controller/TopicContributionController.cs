using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechLoop.Application.Features.TopicContributions.Commands.CreateTopicContribution;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Features.TopicContributions.Queries.Learner.GetMyTopicContributionById;
using TechLoop.Application.Features.TopicContributions.Queries.Learner.GetMyTopicContributions;

namespace TechLoop.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/topic-contributions")]
public sealed class TopicContributionController : ControllerBase
{
    private readonly IMediator _mediator;
    public TopicContributionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTopicContributionRequest request, CancellationToken cancellationToken)
    {
        var learnerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var contributionId = await _mediator.Send(new CreateTopicContributionCommand(learnerId, request), cancellationToken);
        return CreatedAtAction(nameof(GetMyContributionById),
            new
            {
                id = contributionId
            },
            contributionId);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyContributions(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMyTopicContributionsQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("my/{id:int}")]
    public async Task<IActionResult> GetMyContributionById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMyTopicContributionByIdQuery(id), cancellationToken);
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }
}