using MediatR;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Features.Technologies.Queries.GetAllTechnologies.Learner;
using TechLoop.Application.Features.Technologies.Queries.GetTechnologyBySlug.Learner;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("technologies")]
public sealed class TechnologyController : ControllerBase
{
    private readonly IMediator _mediator;

    public TechnologyController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LearnerTechnologyResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllLearnerTechnologiesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<LearnerTechnologyResponse>> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetLearnerTechnologyBySlugQuery(slug), cancellationToken);
        return Ok(result);
    }
}