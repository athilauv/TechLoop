using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Questions.Queries.GetQuestionBySlug.Learner;

public sealed class GetLearnerQuestionBySlugQueryHandler : IRequestHandler<GetLearnerQuestionBySlugQuery, LearnerQuestionResponse>
{
    private readonly IQuestionRepository _repository;

    public GetLearnerQuestionBySlugQueryHandler(IQuestionRepository repository)
    {
        _repository = repository;
    }

    public async Task<LearnerQuestionResponse> Handle(GetLearnerQuestionBySlugQuery request, CancellationToken cancellationToken)
    {
        var question = await _repository.GetPublishedBySlugAsync(request.Slug, cancellationToken);
        if (question is null)
            throw new NotFoundException("Question not found.");

        return new LearnerQuestionResponse
        {
            Id = question.Id,
            SubTopicId = question.SubTopicId,
            QuestionType = question.QuestionType,
            Slug = question.Slug,
            Title = question.Title,
            Description = question.Description,
            ImageUrl = question.ImageUrl,
            Mark = question.Mark,
            Hint = question.Hint,
            TimeLimitSeconds = question.TimeLimitSeconds,
            MemoryLimitMb = question.MemoryLimitMb,
            Difficulty = question.Difficulty
        };
    }
}
