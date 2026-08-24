using TechLoop.Application.Features.Technologies.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechLoop.Application.DTOs.SubTopics.Requests;
using TechLoop.Application.Features.SubTopics.Commands.CreateSubTopic;
using TechLoop.Application.Features.SubTopics.Commands.DeleteSubTopic;
using TechLoop.Application.Features.SubTopics.Commands.UpdateSubTopic;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Features.Technologies.Commands.UpdateTechnology;
using TechLoop.Application.Features.Topics.Commands.CreateTopic;
using TechLoop.Application.Features.Topics.Commands.DeleteTopic;
using TechLoop.Application.Features.Topics.Commands.UpdateTopic;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.DTOs.Questions.Requests;
using TechLoop.Application.Features.Questions.Commands.CreateQuestion;
using TechLoop.Application.Features.Questions.Commands.UpdateQuestion;
using TechLoop.Application.Features.Questions.Commands.DeleteQuestion;
using TechLoop.Application.Features.Questions.Commands.PublishQuestion;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Features.Questions.Queries.GetAllQuestions.Mentor;
using TechLoop.Application.Features.Questions.Queries.GetQuestionById.Mentor;
using TechLoop.Application.Features.SubTopics.Commands.PublishSubTopic;
using TechLoop.Application.Features.Technologies.Commands.PublishTechnology;
using TechLoop.Application.Features.Topics.Commands.PublishTopic;
using TechLoop.Application.Features.Topics.Queries.GetAllTopics.Mentor;
using TechLoop.Application.Features.Topics.Queries.GetTopicById.Mentor;
using TechLoop.Application.Features.MCQ.Commands.CreateMcqOption;
using TechLoop.Application.Features.MCQ.Commands.DeleteMcqOption;
using TechLoop.Application.Features.MCQ.Commands.UpdateMcqOption;
using TechLoop.Application.Features.MCQ.DTOs;
using System.Security.Claims;
using TechLoop.Application.Features.Coding.Commands.CreateCodingTemplate;
using TechLoop.Application.Features.Coding.Commands.CreateTestCase;
using TechLoop.Application.Features.Coding.Commands.DeleteCodingTemplate;
using TechLoop.Application.Features.Coding.Commands.DeleteTestCase;
using TechLoop.Application.Features.Coding.Commands.UpdateCodingTemplate;
using TechLoop.Application.Features.Coding.Commands.UpdateTestCase;
using TechLoop.Application.Features.Coding.DTOs;
using TechLoop.Application.Features.Coding.Queries.GetCodingTemplatesByQuestion.Mentor;
using TechLoop.Application.Features.Coding.Queries.GetTestCasesByQuestion.Mentor;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.CreatePost;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.DeletePost;
using TechLoop.Application.Features.Community.CommunityPosts.Commands.UpdatePost;
using TechLoop.Application.Features.Community.CommunityPosts.Queries.GetFeed;
using TechLoop.Application.Features.Community.CommunityPosts.Queries.GetPostById;
using TechLoop.Application.Features.Community.PostComments.Commands.CreateComment;
using TechLoop.Application.Features.Community.PostComments.Commands.DeleteComment;
using TechLoop.Application.Features.Community.PostComments.Commands.UpdateComment;
using TechLoop.Application.Features.Community.PostComments.DTOs;
using TechLoop.Application.Features.Community.PostComments.Queries.GetCommentById;
using TechLoop.Application.Features.Community.PostComments.Queries.GetPostComments;
using TechLoop.Application.Features.Community.PostLikes.Commands.LikePost;
using TechLoop.Application.Features.Community.PostLikes.Commands.UnlikePost;
using TechLoop.Application.Features.Community.PostLikes.Queries.GetPostLikeStatus;
using TechLoop.Application.Features.Community.SavedPosts.Commands.SavePost;
using TechLoop.Application.Features.Community.SavedPosts.Commands.UnsavePost;
using TechLoop.Application.Features.Community.SavedPosts.Queries.GetSavedPosts;
using TechLoop.Application.Features.Curriculum.Queries.Mentor;
using TechLoop.Application.Features.Discussions.Commands.PinDiscussion;
using TechLoop.Application.Features.Discussions.Commands.UnpinDiscussion;
using TechLoop.Application.Features.Discussions.Queries.GetDiscussionById;
using TechLoop.Application.Features.Discussions.Queries.GetDiscussions;
using TechLoop.Application.Features.MCQ.Queries.GetMcqOptionsByQuestionQuery.Mentor;
using TechLoop.Application.Features.Mentor.Commands.UpdateMentorProfile;
using TechLoop.Application.Features.Mentor.Queries.Mentor.GetMyProfile;
using TechLoop.Application.Features.Submissions.Commands.UpdateSubmissionResult;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Features.SubTopics.Queries.GetAllSubTopics.Mentor;
using TechLoop.Application.Features.SubTopics.Queries.GetSubTopicById.Mentor;
using TechLoop.Application.Features.SubTopics.Queries.Mentor.GetUnpublishedSubTopics;
using TechLoop.Application.Features.TopicContributions.Commands.ReviewTopicContribution;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Features.TopicContributions.Queries.GetPendingTopicContributions;
using TechLoop.Application.Features.TopicContributions.Queries.GetTechnologyTopicContributions;
using TechLoop.Application.Features.TopicContributions.Queries.Mentor.GetMentorTopicContributionById;
using TechLoop.Application.Features.Topics.Queries.GetUnpublishedTopics;

namespace TechLoop.Api.Controllers;

[Authorize(Policy = "MentorOnly")]
[ApiController]
[Route("mentor")]
public sealed class MentorController : ControllerBase
{
    private readonly IMediator _mediator;

    public MentorController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    //update publish
    [HttpPatch("technologies/{id:int}/publish")]
    public async Task<ActionResult<PublishTechnologyResponse>> PublishTechnology(int id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new PublishTechnologyCommand(id), cancellationToken);
        return Ok(result);
    } 
    
    //Update Technology
    [HttpPut("technologies/{id:int}")]
    public async Task<ActionResult<UpdateTechnologyResponse>> UpdateTechnology(
        int id,
        [FromBody] UpdateTechnologyRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateTechnologyCommand(
            id,
            request.CategoryId,
            request.Name,
            request.Description,
            request.Slug,
            request.ImageUrl,
            request.Position);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }


    // Create Topic
    [HttpPost("topics")]
    public async Task<ActionResult<CreateTopicResponse>> CreateTopic(
        [FromBody] CreateTopicCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    // update publish
    [HttpPatch("topics/{id:int}/publish")]
    public async Task<ActionResult<PublishTopicResponse>> PublishTopic(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new PublishTopicCommand(id), cancellationToken);
        return Ok(result);
    }

    //Update Topic
    [HttpPut("topics/{id:int}")]
    public async Task<ActionResult<UpdateTopicResponse>> UpdateTopic(int id,
        [FromBody] UpdateTopicRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdatedTopicCommand(
            id,
            request.TechnologyId,
            request.Title,
            request.Description,
            request.ImageUrl,
            request.Example,
            request.ExampleType,
            request.Slug,
            request.Position,
            request.ShiftPositions);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }

    //Soft Delete Topic
    [HttpDelete("topics/{id:int}")]
    public async Task<ActionResult<DeleteTopicResponse>> DeleteTopic(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteTopicCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    //GET All Topics
    [HttpGet("topics")]
    public async Task<ActionResult<IEnumerable<MentorTopicResponse>>> GetAllTopics(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllMentorTopicsQuery(), cancellationToken);
        return Ok(result);
    }

    //GET Topic By Id
    [HttpGet("topics/{id:int}")]
    public async Task<ActionResult<MentorTopicResponse>> GetTopicById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMentorTopicByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    //create subtop
    [HttpPost("subtopics")]
    public async Task<ActionResult<CreateSubTopicResponse>> CreateSubTopic(
        [FromBody] CreateSubTopicRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateSubTopicCommand(
            request.TopicId,
            request.ParentSubTopicId,
            request.Title,
            request.Description,
            request.ImageUrl,
            request.Slug,
            request.Example,
            request.ExampleType,
            request.Position,
            request.ShiftPositions);

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    // update publish
    [HttpPatch("subtopics/{id:int}/publish")]
    public async Task<ActionResult<PublishSubTopicResponse>> PublishSubTopic(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new PublishSubTopicCommand(id), cancellationToken);
        return Ok(result);
    }

    // Update Subtopic
    [HttpPut("subtopics/{id:int}")]
    public async Task<ActionResult<UpdateSubTopicResponse>> UpdateSubTopic(
        int id,
        [FromBody] UpdateSubTopicRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateSubTopicCommand(
            id,
            request.TopicId,
            request.ParentSubTopicId,
            request.Title,
            request.Description,
            request.ImageUrl,
            request.Slug,
            request.Example,
            request.ExampleType,
            request.Position,
            request.ShiftPositions);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }

    // Soft delete Subtopic
    [HttpDelete("subtopics/{id:int}")]
    public async Task<ActionResult<DeleteSubTopicResponse>> DeleteSubTopic(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteSubTopicCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
    
    // Get SubTopic By Id
    [HttpGet("subtopics/{id:int}")]
    public async Task<ActionResult<MentorSubTopicResponse>> GetSubTopicById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMentorSubTopicByIdQuery(id), cancellationToken);
        return Ok(result);
    }
    
    //get curriculum
    [HttpGet("curriculum")]
    public async Task<IActionResult> GetMentorCurriculum(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMentorCurriculumQuery(), cancellationToken);
        if (result is null)
            return NotFound();

        return Ok(result);
    }

    // Create Question
    [HttpPost("questions")]
    public async Task<ActionResult<CreateQuestionResponse>> CreateQuestion(
        [FromBody] CreateQuestionRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateQuestionCommand(
            request.SubTopicId,
            request.QuestionType,
            request.Title,
            request.Slug,
            request.Description,
            request.ImageUrl,
            request.Mark,
            request.Hint,
            request.Explanation,
            request.TimeLimitSeconds,
            request.MemoryLimitMb,
            request.Difficulty,
            request.Position,
            request.ShiftPositions);

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    // update publish
    [HttpPatch("questions/{id:int}/publish")]
    public async Task<ActionResult<PublishQuestionResponse>> PublishQuestion(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new PublishQuestionCommand(id), cancellationToken);
        return Ok(result);
    }

// Update Question
    [HttpPut("questions/{id:int}")]
    public async Task<ActionResult<UpdateQuestionResponse>> UpdateQuestion(int id,
        [FromBody] UpdateQuestionRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateQuestionCommand(
            id,
            request.SubTopicId,
            request.QuestionType,
            request.Title,
            request.Slug,
            request.Description,
            request.ImageUrl,
            request.Mark,
            request.Hint,
            request.Explanation,
            request.TimeLimitSeconds,
            request.MemoryLimitMb,
            request.Difficulty,
            request.Position,
            request.ShiftPositions);

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

// Soft Delete Question
    [HttpDelete("questions/{id:int}")]
    public async Task<ActionResult<DeleteQuestionResponse>> DeleteQuestion(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteQuestionCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    // Get all questions
    [HttpGet("questions")]
    public async Task<ActionResult<IEnumerable<MentorQuestionResponse>>> GetAllQuestions(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send( new GetAllMentorQuestionsQuery(), cancellationToken);
        return Ok(result);
    }

    // Get question by id
    [HttpGet("questions/{id:int}")]
    public async Task<ActionResult<MentorQuestionResponse>> GetQuestionById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send( new GetMentorQuestionByIdQuery(id), cancellationToken);
        return Ok(result);
    }
    
    // Get all SubTopics
    [HttpGet("subtopics")]
    public async Task<ActionResult<IEnumerable<MentorSubTopicResponse>>> GetAllSubTopics([FromQuery] int? topicId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllMentorSubTopicsQuery(topicId), cancellationToken);
        return Ok(result);
    }

    // Get MCQ options by question
    [HttpGet("questions/{questionId:int}/mcq-options")]
    public async Task<IActionResult> GetMcqOptionsByQuestionId(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetMcqOptionByIdQuery(questionId), cancellationToken);
        return Ok(result);
    }
    
    //Get coding template by question
    [HttpGet("questions/{questionId:int}/coding-templates")]
    public async Task<IActionResult> GetCodingTemplatesByQuestion(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCodingTemplatesByQuestionQuery(questionId), cancellationToken);
        return Ok(result);
    }
    
    //get testcase
    [HttpGet("questions/{questionId:int}/test-cases")]
    public async Task<IActionResult> GetTestCasesByQuestion(int questionId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetTestCasesByQuestionQuery(questionId), cancellationToken);
        return Ok(result);
    }
     
    //Create mcq option
    [HttpPost("questions/{questionId:int}/mcq_options")]
    public async Task<IActionResult> CreateMcqOption(int questionId, [FromBody] CreateMcqOptionRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateMcqOptionCommand
        {
            QuestionId = questionId,
            OptionText = request.OptionText,
            IsCorrect = request.IsCorrect,
            Position = request.Position
        };

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    // Update MCQ Option
    [HttpPut("mcq-options/{id:int}")]
    public async Task<IActionResult> UpdateMcqOption(int id, [FromBody] UpdateMcqOptionRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateMcqOptionCommand
        {
            Id = id,
            OptionText = request.OptionText,
            IsCorrect = request.IsCorrect,
            Position = request.Position
        };

        var response = await _mediator.Send(command, cancellationToken);
        return Ok(response);
    }

    // Delete MCQ Option
    [HttpDelete("mcq-options/{id:int}")]
    public async Task<IActionResult> DeleteMcqOption(int id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteMcqOptionCommand(id), cancellationToken);
        return Ok(new
        {
            Success = true,
            Message = "MCQ option deleted successfully."
        });
    }
    
    // create coding templates
    [HttpPost("questions/{questionId:int}/coding-templates")]
    public async Task<IActionResult> CreateCodingTemplate(int questionId,[FromBody] CreateCodingTemplateRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateCodingTemplateCommand()
        {
            QuestionId = questionId,
            TechnologyId = request.TechnologyId,
            StarterCode = request.StarterCode,
            SolutionCode = request.SolutionCode
        };

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
    
    //update coding template
    [HttpPut("coding-templates/{id:int}")]
    public async Task<IActionResult> UpdateCodingTemplate(int id,[FromBody] UpdateCodingTemplateRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateCodingTemplateCommand()
        {
            Id = id,
            TechnologyId = request.TechnologyId,
            StarterCode = request.StarterCode,
            SolutionCode = request.SolutionCode
        };

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
    
    //delete coding template
    [HttpDelete("coding-templates/{id:int}")]
    public async Task<IActionResult> DeleteCodingTemplate(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send( new DeleteCodingTemplateCommand(id), cancellationToken);
        return Ok(result);
    }
    
    //create test-case
    [HttpPost("questions/{questionId:int}/test-cases")]
    public async Task<IActionResult> CreateTestCase(int questionId, [FromBody] CreateTestCaseRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateTestCaseCommand()
        {
            QuestionId = questionId,
            Input = request.Input,
            ExpectedOutput = request.ExpectedOutput,
            IsHidden = request.IsHidden,
            Position = request.Position
        };

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
    
    //update test-case
    [HttpPut("test-cases/{id:int}")]
    public async Task<IActionResult> UpdateTestCase(int id, [FromBody] UpdateTestCaseRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateTestCaseCommand()
        {
            Id = id,
            Input = request.Input,
            ExpectedOutput = request.ExpectedOutput,
            IsHidden = request.IsHidden,
            Position = request.Position
        };
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
    
    //delete testcase
    [HttpDelete("test-cases/{id:int}")]
    public async Task<IActionResult> DeleteTestCase(int id,CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new DeleteTestCaseCommand(id), cancellationToken);
        return Ok(result);
    }
    
    // Updates the execution result of the specified submission
    [HttpPut("submissions/{id:int}/result")]
    public async Task<IActionResult> UpdateSubmissionResult(int id, [FromBody] UpdateSubmissionRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateSubmissionCommand(id, request);
        var response = await _mediator.Send(command, cancellationToken);
        return Ok(response);
    }
    
    // Get all contributions of a technology (Admin / Mentor)
    [HttpGet("topic-contributions/technology/{technologyId:int}")]
    public async Task<IActionResult> GetTechnologyContributions(int technologyId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetTechnologyTopicContributionsQuery(
                new GetTechnologyTopicContributionsRequest
                {
                    TechnologyId = technologyId
                }),
            cancellationToken);

        return Ok(result);
    }

    // Review a contribution (Approve / Reject / Publish)
    [HttpPut("topic-contributions/{id:int}/review")]
    public async Task<IActionResult> ReviewContribution(int id, [FromBody] ReviewTopicContributionRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var mentorId))
        {
            return Unauthorized();
        }

        request.Id = id;

        var result = await _mediator.Send(new ReviewTopicContributionCommand(mentorId, request), cancellationToken);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
    
    //Get profile
    [HttpGet("profile")]
    public async Task<IActionResult> GetMyProfile()
    {
        var result = await _mediator.Send(new GetMyProfileQuery());
        if (result is null)
            return NotFound();

        return Ok(result);
    }
    
    // Update profile
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateMyProfile( [FromBody] UpdateMentorProfileCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
    
    
    // Returns all discussions.
    [HttpGet("discussions")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetDiscussionsQuery());
        return Ok(result);
    }

    // Returns a discussion by id.
    [HttpGet("discussions/{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetDiscussionByIdQuery(id));
        return Ok(result);
    }
// Pins a discussion.
    [HttpPatch("discussions/{id:int}/pin")]
    public async Task<IActionResult> PinDiscussion(int id)
    {
        var result = await _mediator.Send(new PinDiscussionCommand(id));
        return Ok(result);
    }

// Unpins a discussion.
    [HttpPatch("discussions/{id:int}/unpin")]
    public async Task<IActionResult> UnpinDiscussion(int id)
    {
        var result = await _mediator.Send(new UnpinDiscussionCommand(id));
        return Ok(result);
    }
    
    //get pending contribution
    [HttpGet("topic-contributions/pending")]
    public async Task<IActionResult> GetPendingContributions(CancellationToken cancellationToken)
    {
        var mentorIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(mentorIdValue, out var mentorId))
        {
            return Unauthorized();
        }

        var result = await _mediator.Send(new GetPendingTopicContributionsQuery(mentorId), cancellationToken);
        return Ok(result);
    }
    
    [HttpGet("topic-contributions/{id:int}")]
    public async Task<IActionResult> GetContributionById(int id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var mentorId))
        {
            return Unauthorized();
        }

        var result = await _mediator.Send(new GetMentorTopicContributionByIdQuery(mentorId, id), cancellationToken);
        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
    
    
    //get unpublished topics
    [HttpGet("unpublished-topics")]
    public async Task<IActionResult> GetUnpublishedTopics(CancellationToken cancellationToken)
    {
        var mentorIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(mentorIdValue, out var mentorId))
            return Unauthorized();

        var result = await _mediator.Send( new GetUnpublishedTopicsQuery(mentorId), cancellationToken);
        return Ok(result);
    }
    
    //get unpublished subtopics
    [HttpGet("unpublished-subtopics")]
    public async Task<IActionResult> GetUnpublishedSubTopics(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var mentorId))
            return Unauthorized();
        var result = await _mediator.Send(new GetUnpublishedSubTopicsQuery(mentorId), cancellationToken);
        return Ok(result);
    }
    
    
    [HttpGet("posts")]
    public async Task<IActionResult> GetFeed(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetFeedQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("posts/{postId:int}")]
    public async Task<IActionResult> GetPostById(int postId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPostByIdQuery(postId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("posts")]
    public async Task<IActionResult> Create([FromBody] CreatePostCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPut("posts/{postId:int}")]
    public async Task<IActionResult> Update(int postId, [FromBody] UpdatePostCommand command, CancellationToken cancellationToken)
    {
        command.Id = postId;
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("posts/{postId:int}")]
    public async Task<IActionResult> Delete(int postId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeletePostCommand(postId), cancellationToken);
        return NoContent();
    }

    [HttpPost("posts/{postId:int}/comments")]
    public async Task<IActionResult> CreateComment(int postId, [FromBody] CreateCommentRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateCommentCommand
        {
            PostId = postId,
            ParentCommentId = request.ParentCommentId,
            Content = request.Content
        };

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet("posts/{postId:int}/comments")]
    public async Task<IActionResult> GetPostComments(int postId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPostCommentsQuery(postId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("comments/{commentId:int}")]
    public async Task<IActionResult> GetCommentById(int commentId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCommentByIdQuery(commentId), cancellationToken);
        return Ok(result);
    }

    [HttpPut("comments/{commentId:int}")]
    public async Task<IActionResult> UpdateComment(int commentId, [FromBody] UpdateCommentCommand command, CancellationToken cancellationToken)
    {
        command.Id = commentId;
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("comments/{commentId:int}")]
    public async Task<IActionResult> DeleteComment(int commentId, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteCommentCommand(commentId), cancellationToken);
        return NoContent();
    }

    [HttpPost("posts/{postId:int}/likes")]
    public async Task<IActionResult> LikePost(int postId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new LikePostCommand(postId), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("posts/{postId:int}/likes")]
    public async Task<IActionResult> UnlikePost(int postId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new UnlikePostCommand(postId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("posts/{postId:int}/likes/me")]
    public async Task<IActionResult> GetLikeStatus(int postId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPostLikeStatusQuery(postId), cancellationToken);
        return Ok(result);
    }

    [HttpPost("posts/{postId:int}/save")]
    public async Task<IActionResult> SavePost(int postId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new SavePostCommand(postId), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("posts/{postId:int}/save")]
    public async Task<IActionResult> UnsavePost(int postId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new UnsavePostCommand(postId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("saved-posts")]
    public async Task<IActionResult> GetSavedPosts(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetSavedPostsQuery(), cancellationToken);
        return Ok(result);
    }
    
}