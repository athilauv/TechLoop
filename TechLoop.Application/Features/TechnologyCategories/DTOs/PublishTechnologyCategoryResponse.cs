namespace TechLoop.Application.Features.TechnologyCategories.DTOs;

public sealed class PublishTechnologyCategoryResponse
{
    public bool Success { get; set; }
    public int Id { get; set; }
    public string Message { get; set; } = string.Empty;
}
