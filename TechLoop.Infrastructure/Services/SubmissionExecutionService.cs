using System.Globalization;
using MediatR;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Features.Coding.Services;
using TechLoop.Application.Features.UserStatistics.UpdateUserStatistics;
using TechLoop.Application.Features.UserTopicProgress.UpdateUserTopicProgress;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Infrastructure.Services;

public sealed class SubmissionExecutionService : ISubmissionExecutionService
{
    private readonly IJudge0Service _judge0Service;
    private readonly ISubmissionRepository _submissionRepository;
    private readonly ITestCaseRepository _testCaseRepository;
    private readonly ICodingTemplateRepository _codingTemplateRepository;
    private readonly ITechnologyRepository _technologyRepository;
    private readonly IMediator _mediator;

    public SubmissionExecutionService(
        IJudge0Service judge0Service,
        ISubmissionRepository submissionRepository,
        ITestCaseRepository testCaseRepository,
        ICodingTemplateRepository codingTemplateRepository,
        ITechnologyRepository technologyRepository,
        IMediator mediator)
    {
        _judge0Service = judge0Service;
        _submissionRepository = submissionRepository;
        _testCaseRepository = testCaseRepository;
        _codingTemplateRepository = codingTemplateRepository;
        _technologyRepository = technologyRepository;
        _mediator = mediator;
    }

    public async Task ExecuteAsync(
        Submission submission,
        Question question,
        CancellationToken cancellationToken)
    {
        if (question.QuestionType != QuestionType.coding)
            throw new InvalidOperationException(
                "Only coding questions can have code submissions.");

        var testCases = (await _testCaseRepository.GetByQuestionIdAsync(
                submission.QuestionId,
                cancellationToken))
            .OrderBy(x => x.Position)
            .ToList();

        if (testCases.Count == 0)
            throw new InvalidOperationException("No test cases found for this coding question.");

        var templates = await _codingTemplateRepository.GetByQuestionIdAsync(submission.QuestionId, cancellationToken);
        var template = templates.FirstOrDefault(x => x.TechnologyId == submission.TechnologyId);
        if (template is null)
            throw new InvalidOperationException("Coding template is not configured for the submitted technology.");

        var languageId = await _technologyRepository.GetJudge0LanguageIdAsync(submission.TechnologyId, cancellationToken);
        if (languageId <= 0)
            throw new InvalidOperationException("Judge0 language is not configured for the submitted technology.");

        var executableSource = CodingExecutionSourceBuilder.Build(template.ExecutionCode, submission.SourceCode);
        var passed = 0;
        Judge0ResultResponse? lastResult = null;
        string? firstFailureOutput = null;
        string? firstFailureCompilerOutput = null;
        string? firstFailureMessage = null;
        SubmissionStatus? executionFailureStatus = null;

        foreach (var testCase in testCases)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var judgeSubmission = await _judge0Service.SubmitAsync(
                new Judge0SubmissionRequest
                {
                    SourceCode = executableSource,
                    LanguageId = languageId,
                    StandardInput = testCase.Input,
                    ExpectedOutput = null,
                    CpuTimeLimit = question.TimeLimitSeconds,
                    MemoryLimit = ToJudge0MemoryLimitKb(question.MemoryLimitMb)
                },
                cancellationToken);

            if (judgeSubmission is null ||
                string.IsNullOrWhiteSpace(judgeSubmission.Token))
            {
                throw new InvalidOperationException("Judge0 did not return a submission token.");
            }

            lastResult = await _judge0Service.WaitForResultAsync(judgeSubmission.Token, cancellationToken: cancellationToken);
            if (lastResult.Status.Id != 3)
            {
                executionFailureStatus = MapStatus(lastResult.Status.Id);
                firstFailureOutput ??=
                    lastResult.StandardError ?? lastResult.Message;
                firstFailureCompilerOutput ??= lastResult.CompileOutput;
                firstFailureMessage ??= lastResult.Message;

                break;
            }

            if (OutputsMatch(lastResult.StandardOutput, testCase.ExpectedOutput))
            {
                passed++;
            }
            else if (firstFailureOutput is null)
            {
                firstFailureOutput = lastResult.StandardOutput;
            }
        }

        submission.PassedTestCases = passed;
        submission.TotalTestCases = testCases.Count;
        submission.Score = testCases.Count == 0
            ? 0 : (int)Math.Round((double)passed / testCases.Count * 100,
                MidpointRounding.AwayFromZero);

        submission.ExecutionTimeMs = ConvertTimeToMilliseconds(lastResult?.Time);
        submission.MemoryUsedMb = ConvertMemoryKbToMb(lastResult?.Memory);
        submission.CompilerOutput = firstFailureCompilerOutput ?? lastResult?.CompileOutput;
        submission.RuntimeOutput = firstFailureOutput;
        submission.JudgeToken = lastResult?.Token;
        submission.Status = executionFailureStatus ?? (passed == testCases.Count ? SubmissionStatus.Accepted : SubmissionStatus.WrongAnswer);

        await _submissionRepository.UpdateResultAsync(submission, cancellationToken);
        await _mediator.Send(new UpdateUserStatisticsCommand(submission), cancellationToken);
        await _mediator.Send(new UpdateUserTopicProgressCommand(submission, question), cancellationToken);
    }

    private static bool OutputsMatch(string? actual, string expected)
    {
        static string Normalize(string value) =>
            value.Replace("\r\n", "\n")
                 .Replace("\r", "\n")
                 .Trim();

        return string.Equals(
            Normalize(actual ?? string.Empty),
            Normalize(expected ?? string.Empty),
            StringComparison.Ordinal);
    }

    private static int? ConvertTimeToMilliseconds(string? seconds)
    {
        if (!decimal.TryParse(
                seconds,
                NumberStyles.Number,
                CultureInfo.InvariantCulture,
                out var value))
        {
            return null;
        }

        return (int)Math.Round(value * 1000m, MidpointRounding.AwayFromZero);
    }

    private static int? ConvertMemoryKbToMb(int? memoryKb)
    {
        if (!memoryKb.HasValue)
            return null;

        return (int)Math.Ceiling(memoryKb.Value / 1024d);
    }

    private static decimal? ToJudge0MemoryLimitKb(int? memoryLimitMb)
    {
        if (!memoryLimitMb.HasValue || memoryLimitMb.Value <= 0)
            return null;

        return memoryLimitMb.Value * 1024m;
    }

    private static SubmissionStatus MapStatus(int statusId)
    {
        return statusId switch
        {
            3 => SubmissionStatus.Accepted,
            4 => SubmissionStatus.WrongAnswer,
            5 => SubmissionStatus.TimeLimitExceeded,
            6 => SubmissionStatus.CompileError,
            7 or 8 or 9 or 10 or 11 or 12 or 13 or 14
                => SubmissionStatus.RuntimeError,
            _ => SubmissionStatus.RuntimeError
        };
    }
}
