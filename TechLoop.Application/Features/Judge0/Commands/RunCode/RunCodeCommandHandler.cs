using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Features.Coding.Services;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Judge0.Commands.RunCode;

public sealed class RunCodeCommandHandler : IRequestHandler<RunCodeCommand, Judge0SubmissionResponse?>
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

    public async Task<Judge0SubmissionResponse?> Handle(
        RunCodeCommand request,
        CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetPublishedByIdAsync(
            request.Request.QuestionId,
            cancellationToken);

        if (question is null)
            throw new NotFoundException("Published coding question not found.");

        var templates = await _codingTemplateRepository.GetByQuestionIdAsync(
            question.Id,
            cancellationToken);

        var template = templates.FirstOrDefault();
        if (template is null)
            throw new InvalidOperationException("Coding template is not configured for this question.");

        var executableSource = CodingExecutionSourceBuilder.Build(
            template.ExecutionCode?.Trim(),
            request.Request.SourceCode);

        var languageId = await _technologyRepository.GetJudge0LanguageIdAsync(
            template.TechnologyId,
            cancellationToken);

        if (languageId <= 0)
            throw new InvalidOperationException("Judge0 language is not configured for this technology.");

        return await _judge0Service.SubmitAsync(
            new Judge0SubmissionRequest
            {
                SourceCode = executableSource,
                LanguageId = languageId,
                StandardInput = request.Request.StandardInput,
                ExpectedOutput = request.Request.ExpectedOutput,
                CpuTimeLimit = request.Request.CpuTimeLimit,
                MemoryLimit = request.Request.MemoryLimit
            },
            cancellationToken);
    }
}
