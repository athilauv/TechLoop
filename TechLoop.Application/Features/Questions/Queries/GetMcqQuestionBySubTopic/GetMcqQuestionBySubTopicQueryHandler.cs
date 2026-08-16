using MediatR;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Questions.Queries.GetMcqQuestionBySubTopic;

public sealed class GetMcqQuestionBySubTopicQueryHandler
    : IRequestHandler<
        GetMcqQuestionBySubTopicQuery,
        LearnerMcqQuestionResponse?>
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

    public async Task<LearnerMcqQuestionResponse?> Handle(
        GetMcqQuestionBySubTopicQuery request,
        CancellationToken cancellationToken)
    {
        var question =
            await _questionRepository.GetPublishedMcqQuestionBySubTopicAsync(
                request.SubTopicId,
                cancellationToken);

        if (question is null)
        {
            return null;
        }

        var options =
            await _mcqOptionRepository.GetByQuestionIdAsync(
                question.Id,
                cancellationToken);

        return new LearnerMcqQuestionResponse
        {
            Id = question.Id,
            SubTopicId = question.SubTopicId,
            Slug = question.Slug,
            Title = question.Title,
            Description = question.Description,
            ImageUrl = question.ImageUrl,
            Mark = question.Mark,
            Difficulty = question.Difficulty,
            Position = question.Position,

            Options = options
                .Select(option => new LearnerMcqOptionResponse
                {
                    Id = option.Id,
                    OptionText = option.OptionText,
                    Position = option.Position
                })
                .ToList()
        };
    }
}