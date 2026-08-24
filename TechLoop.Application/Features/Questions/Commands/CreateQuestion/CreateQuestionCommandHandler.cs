using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Questions.Commands.CreateQuestion;

public sealed class CreateQuestionCommandHandler : IRequestHandler<CreateQuestionCommand, CreateQuestionResponse>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateQuestionCommandHandler(IQuestionRepository questionRepository, ICurrentUserService currentUserService)
    {
        _questionRepository = questionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CreateQuestionResponse> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        var subTopicExists = await _questionRepository.SubTopicExistsAsync(request.SubTopicId, cancellationToken);
        if (!subTopicExists)
        {
            throw new NotFoundException("Sub topic not found.");
        }
        var slugExists = await _questionRepository.SlugExistsAsync(request.Slug, cancellationToken);
        if (slugExists)
        {
            throw new ValidationException($"Question slug '{request.Slug}' already exists.");
        }
        var positionExists = await _questionRepository.PositionExistsAsync(request.SubTopicId, request.Position, cancellationToken);
        if (positionExists && !request.ShiftPositions)
        {
            throw new ValidationException($"Question position '{request.Position}' already exists.");
        }
        var question = new Question
        {
            SubTopicId = request.SubTopicId,
            QuestionType = request.QuestionType,
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Description = request.Description ?? string.Empty,
            ImageUrl = request.ImageUrl ?? string.Empty,
            Mark = request.Mark,
            Hint = request.Hint ?? string.Empty,
            Explanation = request.Explanation ?? string.Empty,
            TimeLimitSeconds = request.TimeLimitSeconds,
            MemoryLimitMb = request.MemoryLimitMb,
            Difficulty = request.Difficulty,
            Position = request.Position,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = _currentUserService.UserId
        };

        var id = await _questionRepository.CreateAsync(question, request.ShiftPositions, cancellationToken);
        var createdQuestion = await _questionRepository.GetByIdAsync(id, cancellationToken);
        if (createdQuestion is null)
        {
            throw new Exception("Failed to create question.");
        }

        return new CreateQuestionResponse
        {
            Success = true,
            Message = "Question created successfully."
        };
    }
}