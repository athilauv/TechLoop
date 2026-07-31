using MediatR;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.Features.Coding.Queries.GetCodingTemplatesByQuestion.Learner;
using TechLoop.Application.Features.Coding.Queries.GetTestCasesByQuestion.Learner;
using TechLoop.Application.Features.MCQ.Queries.GetMcqOptionsByQuestionQuery.Learner;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Features.Questions.Queries.GetAllQuestions.Learner;
using TechLoop.Application.Features.Questions.Queries.GetLearnerQuestionById;
using TechLoop.Application.Features.Questions.Queries.GetQuestionDetailsById;

//using TechLoop.Application.Features.Questions.Queries.GetQuestionById.Learner;

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

    // Get all questions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LearnerQuestionResponse>>> GetAllQuestions(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAllLearnerQuestionsQuery(),
            cancellationToken);

        return Ok(result);
    }

    // Get question by id
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
    
    //get mcq-option by question 
    [HttpGet("questions/{questionId:int}/mcq-options")]
    public async Task<IActionResult> GetPublishedMcqOptionsByQuestionId(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPublishedMcqOptionByIdQuery(questionId), cancellationToken);
        return Ok(result);
    }
    
    //get coding template by question
    [HttpGet("questions/{questionId:int}/coding-templates")]
    public async Task<IActionResult> GetPublishedCodingTemplatesByQuestion(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPublishedCodingTemplatesByQuestionQuery(questionId), cancellationToken);
        return Ok(result);
    }
    
    //get testcase
    [HttpGet("questions/{questionId:int}/test-cases")]
    public async Task<IActionResult> GetPublishedTestCasesByQuestion(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send( new GetPublishedTestCasesByQuestionQuery(questionId), cancellationToken);
        return Ok(result);
    }
    
    //Gets the complete details of a question.
    [HttpGet("{id:int}/details")]
    public async Task<ActionResult<QuestionDetailsResponse>> GetQuestionDetails(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetQuestionDetailsByIdQuery(id), cancellationToken);
        return Ok(result);
    }
}