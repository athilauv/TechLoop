using MediatR;
using TechLoop.Application.Features.Coding.DTOs;

namespace TechLoop.Application.Features.Coding.Commands.CreateCodingTemplate;

public sealed record CreateCodingTemplateCommand : IRequest<CreateCodingTemplateResponse>
{
    public int QuestionId { get; init; }
    public int TechnologyId { get; init; }
    public string StarterCode { get; init; } = string.Empty;
    public string? ExecutionCode { get; init; }
    public string? SolutionCode { get; init; }
}
