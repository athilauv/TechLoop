using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.SubTopics.Commands.CreateSubTopic;

public sealed record CreateSubTopicCommand(
    int TopicId,
    int? ParentSubTopicId,
    string Title,
    string Description,
    string? ImageUrl,
    string Slug,
    string? Example,
    ExampleType? ExampleType,
    int Position,
    bool ShiftPositions
) : IRequest<CreateSubTopicResponse>;