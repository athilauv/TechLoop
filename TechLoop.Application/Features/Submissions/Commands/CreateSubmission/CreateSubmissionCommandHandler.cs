using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Features.Submissions.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.Submissions.Commands.CreateSubmission;

public sealed class CreateSubmissionCommandHandler
    : IRequestHandler<CreateSubmissionCommand, CreateSubmissionResponse>
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IQuestionRepository _questionRepository;

    public CreateSubmissionCommandHandler(
        ISubmissionRepository submissionRepository,
        IQuestionRepository questionRepository)
    {
        _submissionRepository = submissionRepository;
        _questionRepository = questionRepository;
    }

    public async Task<CreateSubmissionResponse> Handle(
        CreateSubmissionCommand request,
        CancellationToken cancellationToken)
    {
        // Validate Question
        var question = await _questionRepository.GetByIdAsync(
            request.Request.QuestionId,
            cancellationToken);

        if (question is null)
        {
            throw new NotFoundException("Question not found.");
        }

        var submission = new Submission
        {
            UserId = request.UserId,
            QuestionId = request.Request.QuestionId,
            TechnologyId = request.Request.TechnologyId,
            SourceCode = request.Request.SourceCode,
            Status = SubmissionStatus.Pending,
            SubmittedAt = DateTime.UtcNow
        };

        var id = await _submissionRepository.CreateAsync(
            submission,
            cancellationToken);

        return new CreateSubmissionResponse
        {
            Id = id,
            Message = "Submission created successfully."
        };
    }
}