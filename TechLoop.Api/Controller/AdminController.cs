using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechLoop.Application.Features.Mentor.Commands.CreateMentor;
using TechLoop.Application.Features.Mentor.Commands.DeleteMentor;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Features.Mentor.Queries.Admin.GetAllMentors;
using TechLoop.Application.Features.Mentor.Queries.Admin.GetMentorById;
using TechLoop.Application.Features.Technologies.Commands.CreateTechnology;
using TechLoop.Application.Features.Technologies.Commands.DeleteTechnology;
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

    //Create Category
    [HttpPost("technology-categories")]
    public async Task<IActionResult> CreateTechnologyCategory([FromBody] CreateTechnologyCategoryRequest request)
    {
        var createdBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new CreateTechnologyCategoriesCommand(request, createdBy));
        return Ok(result);
    }

    //Update Category
    [HttpPut("technology-categories/{id:int}")]
    public async Task<IActionResult> UpdateTechnologyCategory(int id, [FromBody] UpdateTechnologyCategoryRequest request)
    {
        var updatedBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new UpdateTechnologyCategoryCommand(id, request, updatedBy));
        return Ok(result);
    }

    //Update Publish
    [HttpPatch("technology-categories/{id:int}/publish")]
    public async Task<IActionResult> PublishTechnologyCategory(int id)
    {
        var result = await _mediator.Send(new PublishTechnologyCategoryCommand(id));
        return Ok(result);
    }

    //Soft Delete technology category
    [HttpDelete("technology-categories/{id:int}")]
    public async Task<IActionResult> DeleteTechnologyCategory(int id)
    {
        var deletedBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new DeleteTechnologyCategoryCommand(id, deletedBy));
        return Ok(result);
    }
    
    //Get all category
    [HttpGet("technology-categories")]
    public async Task<IActionResult> GetAllTechnologyCategories()
    {
        var result = await _mediator.Send(new GetAllTechnologyCategoriesQuery());
        return Ok(result);
    }

    //Get all category by id
    [HttpGet("technology-categories/{id:int}")]
    public async Task<IActionResult> GetTechnologyCategoryById(int id)
    {
        var result = await _mediator.Send(new GetTechnologyCategoryByIdQuery(id));
        if (result is null)
            return NotFound();

        return Ok(result);
    }
    
    // Create Technology
    [HttpPost("technologies")]
    public async Task<ActionResult<CreateTechnologyCategoryResponse>> CreateTechnology(
        [FromBody] CreateTechnologyRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateTechnologyCommand(
            request.CategoryId,
            request.Name,
            request.Description,
            request.Slug,
            request.ImageUrl,
            request.Position);

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
   
    
    //Soft Delete Technology
    [HttpDelete("technologies/{id:int}")]
    public async Task<IActionResult> DeleteTechnology(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteTechnologyCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    // Get all technologies with all details
    [HttpGet("technologies")]
    public async Task<ActionResult<IEnumerable<MentorTechnologyResponse>>> GetAllTechnologies(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllMentorTechnologiesQuery(), cancellationToken);
        return Ok(result);
    }

    // Get all details of  technology by Id
    [HttpGet("technologies/{id:int}")]
    public async Task<ActionResult<MentorTechnologyResponse>> GetTechnologyById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMentorTechnologyByIdQuery(id), cancellationToken);
        return Ok(result);
    }


    //Create mentor
    [HttpPost]
    public async Task<IActionResult> CreateMentor(
        [FromBody] CreateMentorRequest request)
    {
        var command = new CreateMentorCommand(request.Name, request.Email, request.TechnologyId);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    
    //Soft delete mentor
    [HttpDelete("{mentorId:int}")]
    public async Task<IActionResult> DeleteMentor(int mentorId)
    {
        await _mediator.Send(new DeleteMentorCommand(mentorId));
        return NoContent();
    }
    
    //Get all mentor
    [HttpGet]
    public async Task<IActionResult> GetAllMentors()
    {
        var result = await _mediator.Send(new GetAllMentorsQuery());
        return Ok(result);
    }

    //Get mentor by id
    [HttpGet("{mentorId:int}")]
    public async Task<IActionResult> GetMentorById(int mentorId)
    {
        var result = await _mediator.Send(new GetMentorByIdQuery(mentorId));
        if (result is null)
            return NotFound();

        return Ok(result);
    }

}