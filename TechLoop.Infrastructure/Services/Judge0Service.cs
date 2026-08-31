using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;

namespace TechLoop.Infrastructure.Services;

public sealed class Judge0Service : IJudge0Service
{
    private static readonly JsonSerializerOptions JsonOptions =
        new()
        {
            PropertyNameCaseInsensitive = true,
        };

    private readonly HttpClient _httpClient;

    public Judge0Service(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<Judge0SubmissionResponse?> SubmitAsync(
        Judge0SubmissionRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (request.LanguageId <= 0)
            throw new Judge0Exception("A valid Judge0 language id is required.");

        if (string.IsNullOrWhiteSpace(request.SourceCode))
            throw new Judge0Exception("Source code is required.");

        var payload = new Judge0CreateSubmissionPayload
        {
            SourceCode = request.SourceCode,
            LanguageId = request.LanguageId,
            Stdin = request.StandardInput,
            ExpectedOutput = request.ExpectedOutput,
            CpuTimeLimit = request.CpuTimeLimit,
            MemoryLimit = request.MemoryLimit,
        };

        var json = JsonSerializer.Serialize(payload, JsonOptions);

        using var httpRequest = new HttpRequestMessage(
            HttpMethod.Post,
            "submissions?base64_encoded=false&wait=false");

        httpRequest.Content = new StringContent(
            json,
            Encoding.UTF8,
            "application/json");

        httpRequest.Headers.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));

        using var response = await _httpClient.SendAsync(
            httpRequest,
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);

        var responseBody = await response.Content.ReadAsStringAsync(
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new Judge0Exception(
                $"Judge0 submission failed ({(int)response.StatusCode}). {responseBody}");
        }

        var result = JsonSerializer.Deserialize<Judge0SubmissionResponse>(
            responseBody,
            JsonOptions);

        if (result is null || string.IsNullOrWhiteSpace(result.Token))
            throw new Judge0Exception(
                "Judge0 returned an invalid submission response.");

        return result;
    }

    public async Task<Judge0ResultResponse?> GetResultAsync(
        string token,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(token))
            throw new Judge0Exception("Judge0 submission token is required.");

        using var response = await _httpClient.GetAsync(
            $"submissions/{Uri.EscapeDataString(token)}?base64_encoded=false",
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(
                cancellationToken);

            throw new Judge0Exception(
                $"Judge0 result retrieval failed ({(int)response.StatusCode}). {error}");
        }

        var responseBody = await response.Content.ReadAsStringAsync(
            cancellationToken);

        return JsonSerializer.Deserialize<Judge0ResultResponse>(
            responseBody,
            JsonOptions);
    }

    public async Task<Judge0ResultResponse> WaitForResultAsync(
        string token,
        TimeSpan? timeout = null,
        CancellationToken cancellationToken = default)
    {
        var maxWait = timeout ?? TimeSpan.FromSeconds(60);
        var startedAt = DateTime.UtcNow;

        while (DateTime.UtcNow - startedAt < maxWait)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var result = await GetResultAsync(token, cancellationToken);

            if (result is not null && result.Status.Id > 2)
                return result;

            await Task.Delay(
                TimeSpan.FromMilliseconds(300),
                cancellationToken);
        }

        throw new Judge0Exception(
            $"Judge0 execution timed out while waiting for token '{token}'.");
    }

    private sealed class Judge0CreateSubmissionPayload
    {
        [JsonPropertyName("source_code")]
        public string SourceCode { get; init; } = string.Empty;

        [JsonPropertyName("language_id")]
        public int LanguageId { get; init; }

        [JsonPropertyName("stdin")]
        public string? Stdin { get; init; }

        [JsonPropertyName("expected_output")]
        public string? ExpectedOutput { get; init; }

        [JsonPropertyName("cpu_time_limit")]
        public decimal? CpuTimeLimit { get; init; }

        [JsonPropertyName("memory_limit")]
        public decimal? MemoryLimit { get; init; }
    }
}
