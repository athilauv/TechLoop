using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.MCQ.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.MCQ.Queries.GetMcqOptionsByQuestionQuery.Mentor;

public sealed class GetMcqOptionByIdQueryHandler
    : IRequestHandler<GetMcqOptionByIdQuery, IEnumerable<MentorMcqOptionResponse>>
{
    private readonly IMcqOptionRepository _mcqOptionRepository;
    private readonly IQuestionRepository _questionRepository;

    public GetMcqOptionByIdQueryHandler(
        IMcqOptionRepository mcqOptionRepository,
        IQuestionRepository questionRepository)
    {
        _mcqOptionRepository = mcqOptionRepository;
        _questionRepository = questionRepository;
    }

    public async Task<IEnumerable<MentorMcqOptionResponse>> Handle(
        GetMcqOptionByIdQuery request,
        CancellationToken cancellationToken)
    {
        var question = await _questionRepository
            .GetByIdAsync(request.QuestionId, cancellationToken);

        if (question is null)
            throw new NotFoundException("Question not found.");

        var options = await _mcqOptionRepository
            .GetByQuestionIdAsync(request.QuestionId, cancellationToken);

        if (!options.Any())
            throw new NotFoundException(
                "No options have been added to this question yet.");

        return options
            .OrderBy(x => x.Position)
            .ThenBy(x => x.Id)
            .Select(x => new MentorMcqOptionResponse
            {
                Id = x.Id,
                QuestionId = x.QuestionId,
                OptionText = x.OptionText,
                IsCorrect = x.IsCorrect,
                Position = x.Position,
                CreatedBy = x.CreatedBy,
                CreatedAt = x.CreatedAt,
                UpdatedBy = x.UpdatedBy,
                UpdatedAt = x.UpdatedAt
            });
    }
}
