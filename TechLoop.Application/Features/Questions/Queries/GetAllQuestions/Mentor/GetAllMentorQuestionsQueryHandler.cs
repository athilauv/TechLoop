using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Questions.Queries.GetAllQuestions.Mentor;

public sealed class GetAllMentorQuestionsQueryHandler : IRequestHandler<GetAllMentorQuestionsQuery, PagedResult<MentorQuestionResponse>>
{
    private readonly IQuestionRepository _repository;
    private readonly ICurrentUserService _currentUser;
    public GetAllMentorQuestionsQueryHandler(IQuestionRepository repository, ICurrentUserService currentUser) { _repository=repository; _currentUser=currentUser; }

    public async Task<PagedResult<MentorQuestionResponse>> Handle(GetAllMentorQuestionsQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.GetAllMentorAsync(_currentUser.UserId, request.Page, request.PageSize, request.Difficulty, request.SubTopicId, request.QuestionType, request.Search, request.Sort, cancellationToken);
        return new PagedResult<MentorQuestionResponse>
        {
            Items = result.Items.Select(q => new MentorQuestionResponse { Id=q.Id, SubTopicId=q.SubTopicId, QuestionType=q.QuestionType, Slug=q.Slug, Title=q.Title, Description=q.Description, ImageUrl=q.ImageUrl, Mark=q.Mark, Hint=q.Hint, Explanation=q.Explanation, TimeLimitSeconds=q.TimeLimitSeconds, MemoryLimitMb=q.MemoryLimitMb, Difficulty=q.Difficulty, Position=q.Position, PublishedAt=q.PublishedAt, PublishedBy=q.PublishedBy, CreatedAt=q.CreatedAt, CreatedBy=q.CreatedBy, UpdatedAt=q.UpdatedAt, UpdatedBy=q.UpdatedBy, TotalItems=result.TotalItems }).ToList(),
            Page=result.Page, PageSize=result.PageSize, TotalItems=result.TotalItems
        };
    }
}
