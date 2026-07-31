using TechLoop.Application.Features.Topics.DTOs;
using MediatR;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Topics.Commands.UpdateTopic;

public sealed record UpdatedTopicCommand(
    int id,
    int TechnologyId,
    string Title,
    string Description,
    string? ImageUrl,
    string? Example,
    ExampleType? ExampleType,
    string Slug,
    int Position
    ):IRequest<UpdateTopicResponse>;

