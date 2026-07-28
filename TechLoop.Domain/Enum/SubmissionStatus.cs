namespace TechLoop.Domain.Enums;

public enum SubmissionStatus
{
    Pending,
    Accepted,
    WrongAnswer,
    RuntimeError,
    CompileError,
    TimeLimitExceeded,
    MemoryLimitExceeded
}