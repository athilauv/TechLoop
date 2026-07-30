using System.Text.Json.Serialization;

namespace TechLoop.Application.Feature.Judge0.DTOs;

public sealed class Judge0StatusDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
}