using System.Text.Json.Serialization;

namespace TechLoop.Application.Feature.Judge0.DTOs;

public sealed class Judge0SubmissionResponse
{
    [JsonPropertyName("token")]
    public string Token { get; set; } = string.Empty;
}