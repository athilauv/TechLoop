using MediatR;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Queries.GetQuestions;

public sealed class GetQuestionsQueryHandler : IRequestHandler<GetQuestionsQuery, PagedResult<AdminQuestionResponse>>
{
    private readonly IQuestionRepository _repository;
    public GetQuestionsQueryHandler(IQuestionRepository repository) => _repository = repository;

    public async Task<PagedResult<AdminQuestionResponse>> Handle(GetQuestionsQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.GetAllAsync(request.Page, request.PageSize, request.QuestionType, request.Difficulty, request.SubTopicId, request.Search, request.Published, request.Sort, cancellationToken);
        return new PagedResult<AdminQuestionResponse>
        {
            Items = result.Items.Select(q => new AdminQuestionResponse { Id=q.Id, SubTopicId=q.SubTopicId, QuestionType=q.QuestionType, Slug=q.Slug, Title=q.Title, Difficulty=q.Difficulty, Mark=q.Mark, Position=q.Position, PublishedAt=q.PublishedAt, CreatedAt=q.CreatedAt, TotalItems=result.TotalItems }).ToList(),
            Page=result.Page, PageSize=result.PageSize, TotalItems=result.TotalItems
        };
    }
}
