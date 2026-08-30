using MediatR;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Coding.Queries.GetCodingTemplatesByQuestion.Learner;
using TechLoop.Application.Features.Coding.Queries.GetTestCasesByQuestion.Learner;
using TechLoop.Application.Features.MCQ.Queries.GetMcqOptionsByQuestionQuery.Learner;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Features.Questions.Queries.GetAllQuestions.Learner;
using TechLoop.Application.Features.Questions.Queries.GetCodingQuestions;
using TechLoop.Application.Features.Questions.Queries.GetLearnerQuestionById;
using TechLoop.Application.Features.Questions.Queries.GetQuestionBySlug.Learner;
using TechLoop.Application.Features.Questions.Queries.GetMcqQuestionBySubTopic;
using TechLoop.Application.Features.Questions.Queries.GetQuestionDetailsBySlug;


namespace TechLoop.Api.Controllers;

[ApiController]
[Route("questions")]
public sealed class QuestionController : ControllerBase
{
    private readonly IMediator _mediator;

    public QuestionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LearnerQuestionResponse>>> GetAllQuestions(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAllLearnerQuestionsQuery(),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<LearnerQuestionResponse>> GetQuestionBySlug(
        string slug,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetLearnerQuestionBySlugQuery(slug),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("slug/{slug}/details")]
    public async Task<ActionResult<QuestionDetailsResponse>> GetQuestionDetailsBySlug(
        string slug,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetQuestionDetailsBySlugQuery(slug),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<LearnerQuestionResponse>> GetQuestionById(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetLearnerQuestionByIdQuery(id),
            cancellationToken);

        return Ok(result);
    }
    
    [HttpGet("coding")]
    public async Task<IActionResult> GetCodingQuestions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? technologyId = null,
        [FromQuery] int? difficulty = null,
        [FromQuery] int? subTopicId = null,
        [FromQuery] string? search = null,
        [FromQuery] string? sort = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(
            new GetCodingQuestionsQuery(
                page,
                pageSize,
                technologyId,
                difficulty,
                subTopicId,
                search,
                sort),
            cancellationToken);

        return Ok(result);
    }
    
    [HttpGet("questions/{questionId:int}/mcq-options")]
    public async Task<IActionResult> GetPublishedMcqOptionsByQuestionId(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPublishedMcqOptionByIdQuery(questionId), cancellationToken);
        return Ok(result);
    }
    
    [HttpGet("questions/{questionId:int}/coding-templates")]
    public async Task<IActionResult> GetPublishedCodingTemplatesByQuestion(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPublishedCodingTemplatesByQuestionQuery(questionId), cancellationToken);
        return Ok(result);
    }
    
    [HttpGet("questions/{questionId:int}/test-cases")]
    public async Task<IActionResult> GetPublishedTestCasesByQuestion(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send( new GetPublishedTestCasesByQuestionQuery(questionId), cancellationToken);
        return Ok(result);
    }
    
    
    [HttpGet("sub-topic/{subTopicId:int}/mcq")]
    public async Task<IActionResult> GetMcqQuestionBySubTopic(int subTopicId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMcqQuestionBySubTopicQuery(subTopicId), cancellationToken);
        return Ok(result);
    }
}
