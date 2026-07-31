using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechLoop.Application.Features.TopicContributions.Commands.CreateTopicContribution;
using TechLoop.Application.Features.TopicContributions.Commands.ReviewTopicContribution;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Features.TopicContributions.Queries.GetTechnologyTopicContributions;
using TechLoop.Application.Features.TopicContributions.Queries.Learner.GetMyTopicContributionById;
using TechLoop.Application.Features.TopicContributions.Queries.Learner.GetMyTopicContributions;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("api/topic-contributions")]
public sealed class TopicContributionController : ControllerBase
{
    private readonly IMediator _mediator;

    public TopicContributionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Create a new contribution
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTopicContributionRequest request, CancellationToken cancellationToken)
    {
        var learnerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var contributionId = await _mediator.Send(new CreateTopicContributionCommand(learnerId, request), cancellationToken);
        return CreatedAtAction(
            nameof(GetMyContributionById),
            new { id = contributionId },
            contributionId);
    }

    // Get my all topic contribution
    [HttpGet("my")]
    public async Task<IActionResult> GetMyContributions(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMyTopicContributionsQuery(), cancellationToken);
        return Ok(result);
    }

// Get my topic contribution by id 
    [HttpGet("my/{id:int}")]
    public async Task<IActionResult> GetMyContributionById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMyTopicContributionByIdQuery(id), cancellationToken);
        if (result is null)
            return NotFound();

        return Ok(result);
    }
}