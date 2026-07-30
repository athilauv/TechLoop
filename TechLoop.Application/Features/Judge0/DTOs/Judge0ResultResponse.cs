using System.Text.Json.Serialization;

namespace TechLoop.Application.Feature.Judge0.DTOs;

public sealed class Judge0ResultResponse
{
    [JsonPropertyName("stdout")]
    public string? StandardOutput { get; set; }

    [JsonPropertyName("stderr")]
    public string? StandardError { get; set; }

    [JsonPropertyName("compile_output")]
    public string? CompileOutput { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("time")]
    public string? Time { get; set; }

    [JsonPropertyName("memory")]
    public int? Memory { get; set; }

    [JsonPropertyName("token")]
    public string Token { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public Judge0StatusDto Status { get; set; } = new();
}