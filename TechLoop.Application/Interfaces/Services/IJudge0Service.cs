using TechLoop.Application.Feature.Judge0.DTOs;

namespace TechLoop.Application.Interfaces.Infrastructure;

public interface IJudge0Service
{
    Task<Judge0SubmissionResponse?> SubmitAsync(Judge0SubmissionRequest request, CancellationToken cancellationToken = default);
    Task<Judge0ResultResponse?> GetResultAsync(string token, CancellationToken cancellationToken = default);
}