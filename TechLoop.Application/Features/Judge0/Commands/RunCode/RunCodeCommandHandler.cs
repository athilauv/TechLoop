using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Features.Coding.Services;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Judge0.Commands.RunCode;

public sealed class RunCodeCommandHandler
    : IRequestHandler<RunCodeCommand, Judge0ResultResponse?>
{
    private readonly IJudge0Service _judge0Service;
    private readonly IQuestionRepository _questionRepository;
    private readonly ICodingTemplateRepository _codingTemplateRepository;
    private readonly ITechnologyRepository _technologyRepository;

    public RunCodeCommandHandler(
        IJudge0Service judge0Service,
        IQuestionRepository questionRepository,
        ICodingTemplateRepository codingTemplateRepository,
        ITechnologyRepository technologyRepository)
    {
        _judge0Service = judge0Service;
        _questionRepository = questionRepository;
        _codingTemplateRepository = codingTemplateRepository;
        _technologyRepository = technologyRepository;
    }

    public async Task<Judge0ResultResponse?> Handle(
        RunCodeCommand request,
        CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetPublishedByIdAsync(
            request.Request.QuestionId,
            cancellationToken);

        if (question is null)
            throw new NotFoundException("Published coding question not found.");

        if (question.QuestionType != QuestionType.coding)
            throw new ValidationException("Only coding questions can be executed.");

        var technologyId = await _questionRepository.GetQuestionTechnologyIdAsync(
            question.Id,
            cancellationToken);

        if (!technologyId.HasValue || technologyId.Value <= 0)
            throw new InvalidOperationException(
                "Technology is not configured for this coding question.");

        var templates = await _codingTemplateRepository.GetByQuestionIdAsync(
            question.Id,
            cancellationToken);

        var template = templates.FirstOrDefault(
            x => x.TechnologyId == technologyId.Value);

        if (template is null)
            throw new InvalidOperationException(
                "Coding template is not configured for this question technology.");

        var executableSource = CodingExecutionSourceBuilder.Build(
            template.ExecutionCode,
            request.Request.SourceCode);

        var languageId = await _technologyRepository.GetJudge0LanguageIdAsync(
            template.TechnologyId,
            cancellationToken);

        if (languageId <= 0)
            throw new InvalidOperationException(
                "Judge0 language is not configured for this technology.");

        var cpuTimeLimit = request.Request.CpuTimeLimit
            ?? (decimal?)question.TimeLimitSeconds;

        var memoryLimitMb = request.Request.MemoryLimit
            ?? (decimal?)question.MemoryLimitMb;

        var judgeSubmission = await _judge0Service.SubmitAsync(
            new Judge0SubmissionRequest
            {
                SourceCode = executableSource,
                LanguageId = languageId,
                StandardInput = request.Request.StandardInput,
                ExpectedOutput = request.Request.ExpectedOutput,
                CpuTimeLimit = cpuTimeLimit,
                MemoryLimit = ToJudge0MemoryLimitKb(memoryLimitMb)
            },
            cancellationToken);

        if (judgeSubmission is null || string.IsNullOrWhiteSpace(judgeSubmission.Token))
            throw new Judge0Exception("Judge0 did not return a submission token.");

        return await _judge0Service.WaitForResultAsync(
            judgeSubmission.Token,
            cancellationToken: cancellationToken);
    }

    private static decimal? ToJudge0MemoryLimitKb(decimal? memoryLimitMb)
    {
        if (!memoryLimitMb.HasValue || memoryLimitMb.Value <= 0)
            return null;

        return memoryLimitMb.Value * 1024m;
    }
}
