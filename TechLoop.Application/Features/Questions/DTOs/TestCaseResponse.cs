namespace TechLoop.Application.Features.Questions.DTOs;

public sealed class TestCaseResponse
{
    public int Id { get; set; }
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public bool IsHidden { get; set; }
    public int Position { get; set; }
}