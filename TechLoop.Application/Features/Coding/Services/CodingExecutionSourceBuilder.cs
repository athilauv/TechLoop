namespace TechLoop.Application.Features.Coding.Services;

public static class CodingExecutionSourceBuilder
{
    public const string UserCodePlaceholder = "{{USER_CODE}}";

    public static string Build(string? executionCode, string userCode)
    {
        if (string.IsNullOrWhiteSpace(executionCode))
            throw new InvalidOperationException("Coding execution harness is not configured for this question.");

        if (!executionCode.Contains(UserCodePlaceholder, StringComparison.Ordinal))
            throw new InvalidOperationException(
                "Coding execution harness is missing the {{USER_CODE}} placeholder.");

        return executionCode.Replace(
            UserCodePlaceholder,
            userCode,
            StringComparison.Ordinal);
    }
}
