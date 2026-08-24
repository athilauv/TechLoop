using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Questions.Commands.UpdateQuestion;

public sealed class UpdateQuestionCommandHandler : IRequestHandler<UpdateQuestionCommand, UpdateQuestionResponse>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateQuestionCommandHandler(IQuestionRepository questionRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UpdateQuestionResponse> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (question is null)
        {
            throw new NotFoundException("Question not found.");
        }

        var subTopicExists = await _questionRepository.SubTopicExistsAsync(request.SubTopicId, cancellationToken);
        if (!subTopicExists)
        {
            throw new NotFoundException("Sub topic not found.");
        }

        var slugExists = await _questionRepository.SlugExistsAsync(request.Slug, cancellationToken);
        if (slugExists && !question.Slug.Equals(request.Slug, StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException($"Question slug '{request.Slug}' already exists.");
        }

        var positionExists = await _questionRepository.PositionExistsAsync(request.SubTopicId, request.Position, cancellationToken);
        if (positionExists && question.Position != request.Position && !request.ShiftPositions)
        {
            throw new ValidationException($"Question position '{request.Position}' already exists.");
        }

        question.SubTopicId = request.SubTopicId;
        question.QuestionType = request.QuestionType;
        question.Title = request.Title.Trim();
        question.Slug = request.Slug.Trim().ToLowerInvariant();
        question.Description = request.Description ?? string.Empty;
        question.ImageUrl = request.ImageUrl ?? string.Empty;
        question.Mark = request.Mark;
        question.Hint = request.Hint ?? string.Empty;
        question.Explanation = request.Explanation ?? string.Empty;
        question.TimeLimitSeconds = request.TimeLimitSeconds;
        question.MemoryLimitMb = request.MemoryLimitMb;
        question.Difficulty = request.Difficulty;
        question.Position = request.Position;
        question.UpdatedAt = DateTime.UtcNow;
        question.UpdatedBy = _currentUserService.UserId;

        var rowsAffected = await _questionRepository.UpdateAsync(question, request.ShiftPositions, cancellationToken);
        if (rowsAffected <= 0)
        {
            throw new Exception("Failed to update question.");
        }

        return new UpdateQuestionResponse
        {
            Success = true,
            Message = "Question updated successfully."
        };
    }
}