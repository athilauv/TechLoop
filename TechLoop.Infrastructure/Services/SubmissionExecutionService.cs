using MediatR;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Features.UserStatistics.UpdateUserStatistics;
using TechLoop.Application.Features.UserTopicProgress.UpdateUserTopicProgress;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Infrastructure.Services;

public sealed class SubmissionExecutionService : ISubmissionExecutionService
{
    private readonly IJudge0Service _judge0Service;
    private readonly ISubmissionRepository _submissionRepository;
    private readonly ITestCaseRepository _testCaseRepository;
    private readonly ITechnologyRepository _technologyRepository;
    private readonly IMediator _mediator;

    public SubmissionExecutionService(
        IJudge0Service judge0Service,
        ISubmissionRepository submissionRepository,
        ITestCaseRepository testCaseRepository,
        ITechnologyRepository technologyRepository,
        IMediator mediator)
    {
        _judge0Service = judge0Service;
        _submissionRepository = submissionRepository;
        _testCaseRepository = testCaseRepository;
        _technologyRepository = technologyRepository;
        _mediator = mediator;
    }

    
    public async Task ExecuteAsync(
    Submission submission,
    Question question,
    CancellationToken cancellationToken)
{
    Console.WriteLine("===== ExecuteAsync Started =====");

    var languageId = await _technologyRepository.GetJudge0LanguageIdAsync(submission.TechnologyId, cancellationToken);
    Console.WriteLine($"Language Id : {languageId}");
    var testCases = (await _testCaseRepository.GetByQuestionIdAsync(submission.QuestionId, cancellationToken))
        .OrderBy(x => x.Position)
        .ToList();

    Console.WriteLine($"Test Cases : {testCases.Count}");

    if (!testCases.Any()) throw new InvalidOperationException("No test cases found for this question.");
    int passed = 0;
    int total = testCases.Count;
    Judge0ResultResponse? lastResult = null;

    foreach (var testCase in testCases)
    {
        Console.WriteLine($"Running Test Case : {testCase.Position}");
        var request = new Judge0SubmissionRequest
        {
            SourceCode = submission.SourceCode,
            LanguageId = languageId,
            StandardInput = testCase.Input,
            ExpectedOutput = testCase.ExpectedOutput,
            CpuTimeLimit = question.TimeLimitSeconds,
            MemoryLimit = question.MemoryLimitMb
        };

        Console.WriteLine("Submitting to Judge0...");
        var judgeSubmission = await _judge0Service.SubmitAsync(request, cancellationToken);
        Console.WriteLine($"Judge Token : {judgeSubmission?.Token}");

        if (judgeSubmission is null) throw new InvalidOperationException("Judge0 submission failed.");
        lastResult = await WaitForResultAsync( judgeSubmission.Token, cancellationToken);
        Console.WriteLine($"Judge Status : {lastResult.Status.Id}");

        if (lastResult.Status.Id != 3)
        {
            Console.WriteLine("Compilation/Runtime Error");

            submission.Status = MapStatus(lastResult.Status.Id);
            submission.CompilerOutput = lastResult.CompileOutput;
            submission.RuntimeOutput =
                lastResult.StandardError ?? lastResult.Message;

            Console.WriteLine("Updating Submission");
            await _submissionRepository.UpdateResultAsync(submission, cancellationToken);
            Console.WriteLine("Updating User Statistics");
            await _mediator.Send(new UpdateUserStatisticsCommand(submission), cancellationToken);
            Console.WriteLine("Updating User Topic Progress");
            await _mediator.Send(new UpdateUserTopicProgressCommand( submission, question), cancellationToken);
            Console.WriteLine("===== ExecuteAsync Finished =====");
            return;
        }

        if (lastResult.StandardOutput?.Trim() == testCase.ExpectedOutput.Trim()) passed++;
    }

    Console.WriteLine($"Passed : {passed}/{total}");

    submission.PassedTestCases = passed;
    submission.TotalTestCases = total;
    submission.Score = total == 0 ? 0 : (int)Math.Round((double)passed / total * 100);
    submission.ExecutionTimeMs = int.TryParse(lastResult?.Time, out var time) ? time : null;
    submission.MemoryUsedMb = lastResult?.Memory;
    submission.RuntimeOutput = lastResult?.StandardOutput;
    submission.CompilerOutput = lastResult?.CompileOutput;
    submission.JudgeToken = lastResult?.Token;
    submission.Status = passed == total ? SubmissionStatus.Accepted : SubmissionStatus.WrongAnswer;

    Console.WriteLine($"Final Status : {submission.Status}");
    Console.WriteLine("Updating Submission");

    await _submissionRepository.UpdateResultAsync(submission, cancellationToken);
    Console.WriteLine("Updating User Statistics");

    await _mediator.Send(new UpdateUserStatisticsCommand(submission), cancellationToken);

    Console.WriteLine("Updating User Topic Progress");

    await _mediator.Send(new UpdateUserTopicProgressCommand(submission, question), cancellationToken);
    Console.WriteLine("===== ExecuteAsync Finished =====");
}

    private async Task<Judge0ResultResponse> WaitForResultAsync(
        string token,
        CancellationToken cancellationToken)
    {
        while (true)
        {
            await Task.Delay(500, cancellationToken);

            var result = await _judge0Service.GetResultAsync(
                token,
                cancellationToken);

            if (result is null) continue;
            if (result.Status.Id > 2)
            {
                Console.WriteLine("========== Judge0 Result ==========");
                Console.WriteLine($"Token              : {result.Token}");
                Console.WriteLine($"Status Id          : {result.Status.Id}");
                Console.WriteLine($"Status Description : {result.Status.Description}");
                Console.WriteLine($"Time               : {result.Time}");
                Console.WriteLine($"Memory             : {result.Memory}");
                Console.WriteLine($"Standard Output    : {result.StandardOutput}");
                Console.WriteLine($"Standard Error     : {result.StandardError}");
                Console.WriteLine($"Compile Output     : {result.CompileOutput}");
                Console.WriteLine($"Message            : {result.Message}");
                Console.WriteLine("===================================");

                return result;
            }
        }
    }

    private static SubmissionStatus MapStatus(int statusId)
    {
        return statusId switch
        {
            3 => SubmissionStatus.Accepted,
            4 => SubmissionStatus.WrongAnswer,
            5 => SubmissionStatus.TimeLimitExceeded,
            6 => SubmissionStatus.CompileError,
            7 => SubmissionStatus.RuntimeError,
            8 => SubmissionStatus.RuntimeError,
            9 => SubmissionStatus.RuntimeError,
            13 => SubmissionStatus.RuntimeError,
            _ => SubmissionStatus.RuntimeError
        };
    }
}
