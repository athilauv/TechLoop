using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Learner.Profile.Queries.GetLearnerProfile;

namespace TechLoop.Api.Controllers.Learner;

[ApiController]
[Authorize(Roles = "Learner")]
[Route("api/learner/profile")]
public sealed class LearnerProfileController : ControllerBase
{
    private readonly IMediator _mediator;

    public LearnerProfileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var result = await _mediator.Send(new GetLearnerProfileQuery());
        return Ok(result);
    }
}