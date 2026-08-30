using MediatR;
using TechLoop.Application.Features.Coding.DTOs;

namespace TechLoop.Application.Features.Coding.Commands.UpdateCodingTemplate;

public sealed record UpdateCodingTemplateCommand : IRequest<UpdateCodingTemplateResponse>
{
    public int Id { get; init; }

    public int TechnologyId { get; init; }

    public string StarterCode { get; init; } = string.Empty;

    public string? ExecutionCode { get; init; }

    public string? SolutionCode { get; init; }
}