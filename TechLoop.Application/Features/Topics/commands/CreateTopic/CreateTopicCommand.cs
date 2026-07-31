using MediatR;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Topics.Commands.CreateTopic;

public sealed record CreateTopicCommand(
    int TechnologyId,
    string Title,
    string Description,
    string? ImageUrl,
    string? Example,
    ExampleType? ExampleType,
    string Slug,
    int Position
) : IRequest<CreateTopicResponse>;