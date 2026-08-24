using MediatR;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Questions.Commands.CreateQuestion;

public sealed record CreateQuestionCommand(
    int SubTopicId,
    QuestionType QuestionType,
    string Title,
    string Slug,
    string Description,
    string? ImageUrl,
    int Mark,
    string Hint,
    string Explanation,
    int? TimeLimitSeconds,
    int? MemoryLimitMb,
    DifficultyLevel Difficulty,
    int Position,
    bool ShiftPositions
) : IRequest<CreateQuestionResponse>;