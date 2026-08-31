using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Analytics.Queries.GetAnalytics;
using TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgress;
using TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgressList;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("api/analytics")]
[Authorize]
public sealed class AnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUserService;

    public AnalyticsController(IMediator mediator, ICurrentUserService currentUserService)
    {
        _mediator = mediator;
        _currentUserService = currentUserService;
    }

    // Returns combined analytics/dashboard data
    [HttpGet]
    public async Task<IActionResult> GetAnalytics(CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var query = new GetAnalyticsQuery(userId);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }

    // Returns progress of all topics
    [HttpGet("topic-progress")]
    public async Task<IActionResult> GetTopicProgress(CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var response = await _mediator.Send(new GetUserTopicProgressListQuery(userId), cancellationToken);
        return Ok(response);
    }

    // Returns progress of a specific topic.
    [HttpGet("topic-progress/{topicId:int}")]
    public async Task<IActionResult> GetTopicProgressByTopic(int topicId, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var response = await _mediator.Send(new GetUserTopicProgressQuery(userId, topicId), cancellationToken);
        return Ok(response);
    }
}