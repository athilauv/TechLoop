using MediatR;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.SubTopics.Commands.UpdateSubTopic;

public sealed record UpdateSubTopicCommand(
    int Id,
    int TopicId,
    int? ParentSubTopicId,
    string Title,
    string Description,
    string? ImageUrl,
    string Slug,
    string? Example,
    ExampleType? ExampleType,
    int Position
) : IRequest<UpdateSubTopicResponse>;