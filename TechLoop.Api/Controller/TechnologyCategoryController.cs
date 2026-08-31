using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.TechnologyCategories.Queries.GetAllTechnologyCategories.LearnerMentor;
using TechLoop.Application.Features.TechnologyCategories.Queries.GetTechnologyCategoryById.LearnerMentor;

namespace TechLoop.Api.Controllers;

[ApiController]
[Route("technology-categories")]
[Authorize(Roles = "Learner,Mentor")]
public sealed class TechnologyCategoryController : ControllerBase
{
    private readonly IMediator _mediator;
    public TechnologyCategoryController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    // Get all published technology categories.
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllPublishedTechnologyCategoriesQuery());
        return Ok(result);
    }


    // Get a published technology category by Id.
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetPublishedTechnologyCategoryByIdQuery(id));
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }
}