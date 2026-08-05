using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechLoop.Application.Features.UserStatistics.Queries.GetUserStatistics;
using TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgress;
using TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgressList;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("api/user-statistics")]
[Authorize]
public sealed class UserStatisticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserStatisticsController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    // Returns statistics of the currently logged-in user.
    [HttpGet]
    public async Task<IActionResult> GetStatistics(
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var response = await _mediator.Send(
            new GetUserStatisticsQuery(userId),
            cancellationToken);

        return Ok(response);
    }

    // Returns progress of all topics for the currently logged-in user.
    [HttpGet("topic-progress")]
    public async Task<IActionResult> GetTopicProgress(
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var response = await _mediator.Send(
            new GetUserTopicProgressListQuery(userId),
            cancellationToken);

        return Ok(response);
    }
    
    // Returns progress of a specific topic.
    [HttpGet("topic-progress/{topicId:int}")]
    public async Task<IActionResult> GetTopicProgressByTopic(
        int topicId,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var response = await _mediator.Send(
            new GetUserTopicProgressQuery(
                userId,
                topicId),
            cancellationToken);

        return Ok(response);
    }
}