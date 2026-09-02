using MediatR;
using TechLoop.Application.Features.MCQ.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Questions.Queries.GetMcqQuestionBySubTopic;

public sealed class GetMcqQuestionBySubTopicQueryHandler
    : IRequestHandler<
        GetMcqQuestionBySubTopicQuery,
        IReadOnlyList<LearnerMcqQuestionResponse>>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IMcqOptionRepository _mcqOptionRepository;

    public GetMcqQuestionBySubTopicQueryHandler(
        IQuestionRepository questionRepository,
        IMcqOptionRepository mcqOptionRepository)
    {
        _questionRepository = questionRepository;
        _mcqOptionRepository = mcqOptionRepository;
    }

    public async Task<IReadOnlyList<LearnerMcqQuestionResponse>> Handle(
        GetMcqQuestionBySubTopicQuery request,
        CancellationToken cancellationToken)
    {
        var questions =
            await _questionRepository
                .GetPublishedMcqQuestionsBySubTopicAsync(
                    request.SubTopicId,
                    cancellationToken);

        var response = new List<LearnerMcqQuestionResponse>();

        foreach (var question in questions
                     .OrderBy(x => x.Position)
                     .ThenBy(x => x.Id))
        {
            var options =
                await _mcqOptionRepository
                    .GetByQuestionIdAsync(
                        question.Id,
                        cancellationToken);

            var technologyId =
                await _questionRepository
                    .GetQuestionTechnologyIdAsync(
                        question.Id,
                        cancellationToken);

            if (!technologyId.HasValue || technologyId.Value <= 0)
            {
                throw new KeyNotFoundException(
                    "Question technology not found.");
            }

            response.Add(new LearnerMcqQuestionResponse
            {
                Id = question.Id,
                SubTopicId = question.SubTopicId,
                TechnologyId = technologyId.Value,
                Title = question.Title,
                Description = question.Description,
                Difficulty = (int)question.Difficulty,
                Mark = question.Mark,
                Position = question.Position,
                Options = options
                    .OrderBy(x => x.Position)
                    .ThenBy(x => x.Id)
                    .Select(x => new LearnerMcqOptionResponse
                    {
                        Id = x.Id,
                        QuestionId = x.QuestionId,
                        OptionText = x.OptionText,
                        Position = x.Position
                    })
                    .ToList()
            });
        }

        return response;
    }
}
