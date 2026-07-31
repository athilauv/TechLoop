using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Questions.Queries.GetQuestionDetailsById;

public sealed class GetQuestionDetailsByIdQueryHandler : IRequestHandler<GetQuestionDetailsByIdQuery, QuestionDetailsResponse>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IMcqOptionRepository _mcqOptionRepository;
    private readonly ICodingTemplateRepository _codingTemplateRepository;
    private readonly ITestCaseRepository _testCaseRepository;
    public GetQuestionDetailsByIdQueryHandler(IQuestionRepository questionRepository, IMcqOptionRepository mcqOptionRepository, ICodingTemplateRepository codingTemplateRepository, ITestCaseRepository testCaseRepository)
    {
        _questionRepository = questionRepository;
        _mcqOptionRepository = mcqOptionRepository;
        _codingTemplateRepository = codingTemplateRepository;
        _testCaseRepository = testCaseRepository;
    }

    public async Task<QuestionDetailsResponse> Handle(GetQuestionDetailsByIdQuery request, CancellationToken cancellationToken)
    {
        var question = await _questionRepository.GetPublishedByIdAsync(request.Id, cancellationToken);

        if (question is null)
            throw new NotFoundException("Question not found.");

        var response = new QuestionDetailsResponse
        {
            Id = question.Id,
            SubTopicId = question.SubTopicId,
            QuestionType = question.QuestionType,
            Slug = question.Slug,
            Title = question.Title,
            Description = question.Description,
            ImageUrl = question.ImageUrl,
            Mark = question.Mark,
            Hint = question.Hint,
            Explanation = question.Explanation,
            TimeLimitSeconds = question.TimeLimitSeconds,
            MemoryLimitMb = question.MemoryLimitMb,
            Difficulty = question.Difficulty,
            Position = question.Position
        };

        if (question.QuestionType == QuestionType.mcq)
        {
            var options = await _mcqOptionRepository.GetByQuestionIdAsync(question.Id, cancellationToken);
            response.Options = options.Select(x => new QuestionMcqOptionResponse()
            {
                Id = x.Id,
                OptionText = x.OptionText,
                IsCorrect = x.IsCorrect,
                Position = x.Position
            }).ToList();
        }
        else if (question.QuestionType == QuestionType.coding)
        {
            var templates = await _codingTemplateRepository.GetByQuestionIdAsync(
                question.Id,
                cancellationToken);

            response.CodingTemplate = templates
                .Select(x => new CodingTemplateResponse
                {
                    Id = x.Id,
                    TechnologyId = x.TechnologyId,
                    StarterCode = x.StarterCode,
                    SolutionCode = x.SolutionCode
                })
                .FirstOrDefault();

            var testCases = await _testCaseRepository.GetByQuestionIdAsync(
                question.Id,
                cancellationToken);

            response.TestCases = testCases.Select(x => new TestCaseResponse
            {
                Id = x.Id,
                Input = x.Input,
                ExpectedOutput = x.ExpectedOutput,
                IsHidden = x.IsHidden,
                Position = x.Position
            }).ToList();
        }

        return response;
    }
}