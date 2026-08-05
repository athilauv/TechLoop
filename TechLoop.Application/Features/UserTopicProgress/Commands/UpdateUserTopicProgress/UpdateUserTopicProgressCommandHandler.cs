using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.UserTopicProgress.UpdateUserTopicProgress;

public sealed class UpdateUserTopicProgressCommandHandler : IRequestHandler<UpdateUserTopicProgressCommand>
{
    private readonly IUserTopicProgressRepository _repository;
    private readonly ISubTopicsRepository _subTopicsRepository;

    public UpdateUserTopicProgressCommandHandler(IUserTopicProgressRepository repository, ISubTopicsRepository subTopicsRepository)
    {
        _repository = repository;
        _subTopicsRepository = subTopicsRepository;
    }

    public async Task Handle(UpdateUserTopicProgressCommand request, CancellationToken cancellationToken)
    {
        Console.WriteLine("UpdateUserTopicProgressCommandHandler Called");
        var submission = request.Submission;
        var question = request.Question;

        // Only accepted submissions should update progress.
        if (submission.Status != SubmissionStatus.Accepted)
        {
            return;
        }

        var topicId = await _subTopicsRepository.GetTopicIdAsync(
            question.SubTopicId,
            cancellationToken);

        var progress = await _repository.GetByUserAndTopicAsync(
            submission.UserId,
            topicId,
            cancellationToken);

        if (progress is null)
        {
            progress = new Domain.Entities.UserTopicProgress
            {
                UserId = submission.UserId,
                TopicId = topicId,
                CompletedQuestions = 1,
                LastPracticedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(
                progress,
                cancellationToken);

            return;
        }

        progress.CompletedQuestions++;
        progress.LastPracticedAt = DateTime.UtcNow;
        progress.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(
            progress,
            cancellationToken);
    }
}