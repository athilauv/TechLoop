using MediatR;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Features.Topics.Queries.GetAllTopics.Learner;
using TechLoop.Application.Features.Topics.Queries.GetTopicBySlug.Learner;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("topics")]
public sealed class TopicController : ControllerBase
{
    private readonly IMediator _mediator;
    public TopicController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Get all published topics 
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LearnerTopicResponse>>> GetAllTopics(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllLearnerTopicsQuery(), cancellationToken);
        return Ok(result);
    }

    // Get published topic by slug
    [HttpGet("{slug}")]
    public async Task<ActionResult<LearnerTopicResponse>> GetTopicBySlug(string slug, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetLearnerTopicBySlugQuery(slug), cancellationToken);
        return Ok(result);
    }
}
