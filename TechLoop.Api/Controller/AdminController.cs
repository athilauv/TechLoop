using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechLoop.Application.Features.Admin.Commands.UpdateUserRole;
using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Features.Admin.Queries.GetDashboard;
using TechLoop.Application.Features.Admin.Queries.GetQuestions;
using TechLoop.Application.Features.Admin.Queries.GetCommunity;
using TechLoop.Application.Features.Admin.Queries.GetMentorOverview;
using TechLoop.Application.Features.Admin.Queries.GetPendingContributions;
using TechLoop.Application.Features.Admin.Queries.GetUsers;
using TechLoop.Application.Features.Mentor.Commands.CreateMentor;
using TechLoop.Application.Features.Mentor.Commands.DeleteMentor;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Features.Mentor.Queries.Admin.GetAllMentors;
using TechLoop.Application.Features.Mentor.Queries.Admin.GetMentorById;
using TechLoop.Application.Features.Technologies.Commands.CreateTechnology;
using TechLoop.Application.Features.Technologies.Commands.DeleteTechnology;
using TechLoop.Application.Features.Technologies.Commands.PublishTechnology;
using TechLoop.Application.Features.Technologies.Commands.PublishAdminTechnology;
using TechLoop.Application.Features.Technologies.Commands.UpdateTechnology;
using TechLoop.Application.Features.Technologies.DTOs;
using TechLoop.Application.Features.Technologies.Queries.GetAllTechnologies.Mentor;
using TechLoop.Application.Features.Technologies.Queries.GetTechnologyById.Mentor;
using TechLoop.Application.Features.TechnologyCategories.Commands.CreateTechnologyCategory;
using TechLoop.Application.Features.TechnologyCategories.Commands.DeleteTechnologyCategory;
using TechLoop.Application.Features.TechnologyCategories.Commands.PublishTechnologyCategory;
using TechLoop.Application.Features.TechnologyCategories.Commands.UpdateTechnologyCategory;
using TechLoop.Application.Features.TechnologyCategories.DTOs;
using TechLoop.Application.Features.TechnologyCategories.Queries.GetAllTechnologyCategories.Admin;
using TechLoop.Application.Features.TechnologyCategories.Queries.GetTechnologyCategoryById.Admin;

namespace TechLoop.Api.Controllers;

[Authorize(Roles = "Admin")]
[Route("admin")]
[ApiController]
public sealed class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardResponse>> GetDashboard(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetDashboardQuery(), cancellationToken));
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<AdminUserResponse>>> GetUsers(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetUsersQuery(), cancellationToken));
    }

    [HttpPatch("users/{userId:guid}/role")]
    public async Task<IActionResult> UpdateUserRole(Guid userId, [FromBody] AdminUpdateUserRoleRequest request, CancellationToken cancellationToken)
    {
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (currentUserId == userId)
            return BadRequest(new { message = "An administrator cannot change their own role." });

        var updated = await _mediator.Send(new UpdateUserRoleCommand(userId, request), cancellationToken);
        return updated ? Ok(new { success = true, message = "User role updated successfully." }) : NotFound();
    }

    [HttpGet("mentors/{mentorId:int}/overview")]
    public async Task<ActionResult<AdminMentorOverviewResponse>> GetMentorOverview(int mentorId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMentorOverviewQuery(mentorId), cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("topic-contributions/pending")]
    public async Task<IActionResult> GetPendingContributions(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetPendingContributionsQuery(), cancellationToken));
    }

    [HttpGet("questions")]
    public async Task<IActionResult> GetQuestions(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetQuestionsQuery(), cancellationToken));
    }

    [HttpGet("community")]
    public async Task<IActionResult> GetCommunity(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetCommunityQuery(), cancellationToken));
    }

    [HttpPost("technology-categories")]
    public async Task<IActionResult> CreateTechnologyCategory([FromBody] CreateTechnologyCategoryRequest request, CancellationToken cancellationToken)
    {
        var createdBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _mediator.Send(new CreateTechnologyCategoriesCommand(request, createdBy), cancellationToken));
    }

    [HttpPut("technology-categories/{id:int}")]
    public async Task<IActionResult> UpdateTechnologyCategory(int id, [FromBody] UpdateTechnologyCategoryRequest request, CancellationToken cancellationToken)
    {
        var updatedBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _mediator.Send(new UpdateTechnologyCategoryCommand(id, request, updatedBy), cancellationToken));
    }

    [HttpPatch("technology-categories/{id:int}/publish")]
    public async Task<IActionResult> PublishTechnologyCategory(int id, CancellationToken cancellationToken)
    {
        var publishedBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _mediator.Send(new PublishTechnologyCategoryCommand(id, publishedBy), cancellationToken));
    }

    [HttpDelete("technology-categories/{id:int}")]
    public async Task<IActionResult> DeleteTechnologyCategory(int id, CancellationToken cancellationToken)
    {
        var deletedBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _mediator.Send(new DeleteTechnologyCategoryCommand(id, deletedBy), cancellationToken));
    }

    [HttpGet("technology-categories")]
    public async Task<IActionResult> GetAllTechnologyCategories(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetAllTechnologyCategoriesQuery(), cancellationToken));
    }

    [HttpGet("technology-categories/{id:int}")]
    public async Task<IActionResult> GetTechnologyCategoryById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetTechnologyCategoryByIdQuery(id), cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("technologies")]
    public async Task<IActionResult> CreateTechnology([FromBody] CreateTechnologyRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateTechnologyCommand(request.CategoryId, request.Name, request.Description, request.Slug, request.ImageUrl, request.Position);
        return Ok(await _mediator.Send(command, cancellationToken));
    }

    [HttpPut("technologies/{id:int}")]
    public async Task<IActionResult> UpdateTechnology(int id, [FromBody] UpdateTechnologyRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateTechnologyCommand(id, request.CategoryId, request.Name, request.Description ?? string.Empty, request.Slug, request.ImageUrl ?? string.Empty, request.Position);
        return Ok(await _mediator.Send(command, cancellationToken));
    }

    [HttpPatch("technologies/{id:int}/publish")]
    public async Task<IActionResult> PublishTechnology(int id, CancellationToken cancellationToken)
    {
        var publishedBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _mediator.Send(new PublishAdminTechnologyCommand(id, publishedBy), cancellationToken));
    }

    [HttpDelete("technologies/{id:int}")]
    public async Task<IActionResult> DeleteTechnology(int id, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new DeleteTechnologyCommand(id), cancellationToken));
    }

    [HttpGet("technologies")]
    public async Task<ActionResult<IEnumerable<MentorTechnologyResponse>>> GetAllTechnologies(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetAllMentorTechnologiesQuery(), cancellationToken));
    }

    [HttpGet("technologies/{id:int}")]
    public async Task<ActionResult<MentorTechnologyResponse>> GetTechnologyById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMentorTechnologyByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("mentors")]
    public async Task<IActionResult> CreateMentor([FromBody] CreateMentorRequest request, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new CreateMentorCommand(request.Name, request.Email, request.TechnologyId), cancellationToken));
    }

    [HttpDelete("mentors/{mentorId:int}")]
    public async Task<IActionResult> DeleteMentor(int mentorId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteMentorCommand(mentorId), cancellationToken);
        return Ok(new { success = true, message = "Mentor deleted successfully." });
    }

    [HttpGet("mentors")]
    public async Task<IActionResult> GetAllMentors(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetAllMentorsQuery(), cancellationToken));
    }

    [HttpGet("mentors/{mentorId:int}")]
    public async Task<IActionResult> GetMentorById(int mentorId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMentorByIdQuery(mentorId), cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }
}
