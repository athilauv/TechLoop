using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Curriculum.Queries;
using TechLoop.Application.Features.Curriculum.Queries.Mentor;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("curriculum")]
public sealed class CurriculumController : ControllerBase
{
    private readonly IMediator _mediator;

    public CurriculumController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet("learner/{technologyId:int}")]
    public async Task<IActionResult> GetLearnerCurriculum(int technologyId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetLearnerCurriculumQuery(technologyId), cancellationToken);
        if (result is null)
            return NotFound();

        return Ok(result);
    }
    
}