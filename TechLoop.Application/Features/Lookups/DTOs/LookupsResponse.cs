namespace TechLoop.Application.Features.Lookups.DTOs;

public sealed class LookupsResponse
{
    public IEnumerable<LookupOptionResponse> DifficultyLevels { get; set; } = Array.Empty<LookupOptionResponse>();
    public IEnumerable<LookupOptionResponse> QuestionTypes { get; set; } = Array.Empty<LookupOptionResponse>();
    public IEnumerable<LookupOptionResponse> ExampleTypes { get; set; } = Array.Empty<LookupOptionResponse>();
}
