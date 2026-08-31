namespace TechLoop.Application.Features.Coding.Services;

public static class CodingExecutionSourceBuilder
{
    public const string UserCodePlaceholder = "{{USER_CODE}}";

    public static string Build(string? executionCode, string userCode)
    {
        if (string.IsNullOrWhiteSpace(userCode))
            throw new InvalidOperationException("User source code is required.");

        if (string.IsNullOrWhiteSpace(executionCode))
            return userCode.Trim();

        var normalizedUserCode = Normalize(userCode).TrimEnd();
        var normalizedExecutionCode = Normalize(executionCode).Trim();

        // Preferred format:
        // {{USER_CODE}}
        // console.log(...)
        if (normalizedExecutionCode.Contains(
                UserCodePlaceholder,
                StringComparison.Ordinal))
        {
            return normalizedExecutionCode.Replace(
                UserCodePlaceholder,
                normalizedUserCode,
                StringComparison.Ordinal);
        }

        // If the frontend already included the execution code in the
        // submitted editor content, do not append it a second time.
        if (normalizedUserCode.EndsWith(
                normalizedExecutionCode,
                StringComparison.Ordinal))
        {
            return normalizedUserCode;
        }

        // Also support mentor templates where Execution Code contains only
        // the runner/harness and Starter/User Code is supplied separately.
        return $"{normalizedUserCode}{Environment.NewLine}{normalizedExecutionCode}";
    }

    private static string Normalize(string value)
        => value.Replace("\r\n", "\n").Replace("\r", "\n");
}
