namespace TechLoop.Application.Features.TechnologyCategories.DTOs;

public sealed class DeleteTechnologyCategoryResponse
{
    public bool Success { get; set; }
    public int Id { get; set; }
    public string Message { get; set; } = string.Empty;
}
