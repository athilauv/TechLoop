using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Coding.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Coding.Queries.GetCodingTemplatesByQuestion.Mentor;

public sealed class GetCodingTemplatesByQuestionQueryHandler : IRequestHandler<GetCodingTemplatesByQuestionQuery, IEnumerable<MentorCodingTemplateResponse>>
{
    private readonly ICodingTemplateRepository _codingTemplateRepository;
    private readonly IQuestionRepository _questionRepository;

    public GetCodingTemplatesByQuestionQueryHandler(ICodingTemplateRepository codingTemplateRepository, IQuestionRepository questionRepository)
    {
        _codingTemplateRepository = codingTemplateRepository;
        _questionRepository = questionRepository;
    }

    public async Task<IEnumerable<MentorCodingTemplateResponse>> Handle(GetCodingTemplatesByQuestionQuery request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.QuestionId, cancellationToken);
        if (question is null)
            throw new NotFoundException("Question not found.");

        var templates = await _codingTemplateRepository.GetByQuestionIdAsync(request.QuestionId, cancellationToken);
        return templates.Select(x => new MentorCodingTemplateResponse
        {
            Id = x.Id,
            QuestionId = x.QuestionId,
            TechnologyId = x.TechnologyId,
            StarterCode = x.StarterCode,
            SolutionCode = x.SolutionCode,
            CreatedBy = x.CreatedBy,
            CreatedAt = x.CreatedAt,
            UpdatedBy = x.UpdatedBy,
            UpdatedAt = x.UpdatedAt
        });
    }
}
