using MediatR;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Questions.Queries.GetCodingQuestions;

public sealed class GetCodingQuestionsQueryHandler
    : IRequestHandler<GetCodingQuestionsQuery, IEnumerable<LearnerCodingQuestionDto>>
{
    private readonly IQuestionRepository _questionRepository;

    public GetCodingQuestionsQueryHandler(
        IQuestionRepository questionRepository)
    {
        _questionRepository = questionRepository;
    }

    public async Task<IEnumerable<LearnerCodingQuestionDto>> Handle(
        GetCodingQuestionsQuery request,
        CancellationToken cancellationToken)
    {
        return await _questionRepository.GetCodingQuestionsAsync(
            request.Page,
            request.PageSize,
            request.TechnologyId,
            request.Difficulty,
            request.SubTopicId,
            request.Search,
            request.Sort,
            cancellationToken);
    }
}