using MediatR;
using TechLoop.Application.Features.Admin.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Queries.GetQuestions;

public sealed class GetQuestionsQueryHandler : IRequestHandler<GetQuestionsQuery, IEnumerable<AdminQuestionResponse>>
{
    private readonly IQuestionRepository _repository;

    public GetQuestionsQueryHandler(IQuestionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AdminQuestionResponse>> Handle(GetQuestionsQuery request, CancellationToken cancellationToken)
    {
        var questions = await _repository.GetAllAsync(cancellationToken);
        return questions.Select(question => new AdminQuestionResponse
        {
            Id = question.Id,
            SubTopicId = question.SubTopicId,
            QuestionType = question.QuestionType,
            Slug = question.Slug,
            Title = question.Title,
            Difficulty = question.Difficulty,
            Mark = question.Mark,
            Position = question.Position,
            PublishedAt = question.PublishedAt,
            CreatedAt = question.CreatedAt
        });
    }
}
