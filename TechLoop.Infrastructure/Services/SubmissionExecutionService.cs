using TechLoop.Application.Feature.Judge0.DTOs;
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
    private readonly ITechnologyRepository _technologyRepository;

    public SubmissionExecutionService(
        IJudge0Service judge0Service,
        ISubmissionRepository submissionRepository,
        ITestCaseRepository testCaseRepository,
        ITechnologyRepository technologyRepository)
    {
        _judge0Service = judge0Service;
        _submissionRepository = submissionRepository;
        _testCaseRepository = testCaseRepository;
        _technologyRepository = technologyRepository;
    }

    public async Task ExecuteAsync(Submission submission, Question question, CancellationToken cancellationToken)
    {
        var languageId = await _technologyRepository.GetJudge0LanguageIdAsync(submission.TechnologyId, cancellationToken);
        var testCases = (await _testCaseRepository.GetByQuestionIdAsync(submission.QuestionId, cancellationToken))
            .OrderBy(x => x.Position)
            .ToList();

        if (!testCases.Any())
        {
            throw new InvalidOperationException("No test cases found for this question.");
        }
        
        int passed = 0;
        int total = testCases.Count;
        Judge0ResultResponse? lastResult = null;
        
        foreach (var testCase in testCases)
        {
            var request = new Judge0SubmissionRequest
            {
                SourceCode = submission.SourceCode,
                LanguageId = languageId,
                StandardInput = testCase.Input,
                ExpectedOutput = testCase.ExpectedOutput,
                CpuTimeLimit = question.TimeLimitSeconds,
                MemoryLimit = question.MemoryLimitMb
            };

            var judgeSubmission = await _judge0Service.SubmitAsync(request, cancellationToken);
            if (judgeSubmission is null)
            {
                throw new InvalidOperationException("Judge0 submission failed.");
            }

            lastResult = await WaitForResultAsync(judgeSubmission.Token, cancellationToken);
            
            if (lastResult.Status.Id != 3)
            {
                submission.Status = MapStatus(lastResult.Status.Id);
                submission.CompilerOutput = lastResult.CompileOutput;
                submission.RuntimeOutput = lastResult.StandardError ?? lastResult.Message;

                await _submissionRepository.UpdateResultAsync(submission, cancellationToken);
                return;
            }
            
            if (lastResult.StandardOutput?.Trim() == testCase.ExpectedOutput.Trim())
            {
                passed++;
            }
        }
        submission.PassedTestCases = passed;
        submission.TotalTestCases = total;
        submission.Score = total == 0 ? 0 : (int)Math.Round((double)passed / total * 100);
        submission.ExecutionTimeMs = int.TryParse(lastResult?.Time, out var time) ? time : null;
        submission.MemoryUsedMb = lastResult?.Memory;
        submission.RuntimeOutput = lastResult?.StandardOutput;
        submission.CompilerOutput = lastResult?.CompileOutput;
        submission.JudgeToken = lastResult?.Token;
        if (passed == total)
        {
            submission.Status = SubmissionStatus.Accepted;
        }
        else
        {
            submission.Status = SubmissionStatus.WrongAnswer;
        }

        await _submissionRepository.UpdateResultAsync(submission, cancellationToken);
    }
    
    private async Task<Judge0ResultResponse> WaitForResultAsync(string token, CancellationToken cancellationToken)
    {
        while (true)
        {
            await Task.Delay(500, cancellationToken);
            var result = await _judge0Service.GetResultAsync(token, cancellationToken);
            if (result is null)
            {
                continue;
            }

            if (result.Status.Id > 2)
            {
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