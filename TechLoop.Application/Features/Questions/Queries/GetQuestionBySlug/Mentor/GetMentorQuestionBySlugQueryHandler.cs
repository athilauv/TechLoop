using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Questions.Queries.GetQuestionBySlug.Mentor;

public sealed class GetMentorQuestionBySlugQueryHandler : IRequestHandler<GetMentorQuestionBySlugQuery, MentorQuestionResponse>
{
    private readonly IQuestionRepository _repository;

    public GetMentorQuestionBySlugQueryHandler(IQuestionRepository repository)
    {
        _repository = repository;
    }

    public async Task<MentorQuestionResponse> Handle(GetMentorQuestionBySlugQuery request, CancellationToken cancellationToken)
    {
        var question = await _repository.GetBySlugAsync(request.Slug, cancellationToken);
        if (question is null)
            throw new NotFoundException("Question not found.");

        return new MentorQuestionResponse
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
            Explanation = question.Explanation,
            TimeLimitSeconds = question.TimeLimitSeconds,
            MemoryLimitMb = question.MemoryLimitMb,
            Difficulty = question.Difficulty,
            Position = question.Position,
            PublishedAt = question.PublishedAt,
            PublishedBy = question.PublishedBy,
            CreatedAt = question.CreatedAt,
            CreatedBy = question.CreatedBy,
            UpdatedAt = question.UpdatedAt,
            UpdatedBy = question.UpdatedBy
        };
    }
}
