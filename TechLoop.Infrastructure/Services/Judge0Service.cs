using System.Net.Http.Json;
using System.Text.Json;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;

namespace TechLoop.Infrastructure.Services;

public sealed class Judge0Service : IJudge0Service
{
    private static readonly JsonSerializerOptions JsonOptions =
        new()
        {
            PropertyNameCaseInsensitive = true
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

        var payload = new
        {
            source_code = request.SourceCode,
            language_id = request.LanguageId,
            stdin = request.StandardInput,
            expected_output = request.ExpectedOutput,
            cpu_time_limit = request.CpuTimeLimit,
            memory_limit = request.MemoryLimit
        };
        
        var json = JsonSerializer.Serialize(payload);
        Console.WriteLine("=================================");
        Console.WriteLine(json);
        Console.WriteLine("=================================");

        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
        using var response = await _httpClient.PostAsync("submissions?base64_encoded=false&wait=false", content, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);

            throw new Judge0Exception(
                $"Judge0 submission failed. {error}");
        }

        return await response.Content.ReadFromJsonAsync<Judge0SubmissionResponse>(
            JsonOptions,
            cancellationToken);
    }

    public async Task<Judge0ResultResponse?> GetResultAsync(
        string token,
        CancellationToken cancellationToken = default)
    {
        using var response = await _httpClient.GetAsync(
            $"submissions/{token}?base64_encoded=false",
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);

            throw new Judge0Exception(
                $"Judge0 result retrieval failed. {error}");
        }

        return await response.Content.ReadFromJsonAsync<Judge0ResultResponse>(
            JsonOptions,
            cancellationToken);
    }
}