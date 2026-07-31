using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Questions.Commands.PublishQuestion;

public sealed class PublishQuestionCommandHandler : IRequestHandler<PublishQuestionCommand, PublishQuestionResponse>
{
    private readonly IQuestionRepository _repository;
    private readonly ICurrentUserService _currentUser;

    public PublishQuestionCommandHandler(IQuestionRepository repository, ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<PublishQuestionResponse> Handle(PublishQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (question is null)
        {
            throw new NotFoundException("Question not found.");
        }

        if (question.PublishedAt is not null)
        {
            throw new ValidationException("Question is already published.");
        }
        
        if (question.QuestionType == QuestionType.mcq)
        {
            var optionCount = await _repository.GetMcqOptionCountAsync(question.Id, cancellationToken);

            if (optionCount != 4)
            {
                throw new ValidationException(
                    "MCQ question must contain exactly 4 options before publishing.");
            }
        }
        
        if (question.QuestionType == QuestionType.coding)
        {
            var hasTemplate = await _repository.HasCodingTemplateAsync(question.Id, cancellationToken);
            if (!hasTemplate)
            {
                throw new ValidationException("Coding question must contain at least one coding template before publishing.");
            }

            var hasTestCases = await _repository.HasTestCasesAsync(question.Id, cancellationToken);
            if (!hasTestCases)
            {
                throw new ValidationException("Coding question must contain at least one test case before publishing.");
            }
        }

        question.PublishedAt = DateTime.UtcNow;
        question.PublishedBy = _currentUser.UserId;
        
        var rowsAffected = await _repository.PublishAsync(question, cancellationToken);
        // if (rowsAffected <= 0)
        // {
        //     throw new Exception("Failed to publish question.");
        // }

        return new PublishQuestionResponse
        {
            Success = true,
            Message = "Question published successfully."
        };
    }
}