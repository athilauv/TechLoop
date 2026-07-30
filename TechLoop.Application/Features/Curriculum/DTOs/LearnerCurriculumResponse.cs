namespace TechLoop.Application.Features.Curriculum.DTOs;

public sealed class LearnerCurriculumResponse
{
    public int TechnologyId { get; set; }
    public string TechnologyName { get; set; } = string.Empty;
    public List<CurriculumTopicResponse> Topics { get; set; } = [];
}