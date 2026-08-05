using MediatR;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;
using TechLoop.Domain.Enums;

namespace TechLoop.Application.Features.UserStatistics.UpdateUserStatistics;

public sealed class UpdateUserStatisticsCommandHandler : IRequestHandler<UpdateUserStatisticsCommand>
{
    private readonly IUserStatisticsRepository _repository;
    private readonly IQuestionRepository _questionRepository;
    public UpdateUserStatisticsCommandHandler(IUserStatisticsRepository repository, IQuestionRepository questionRepository)
    {
        _repository = repository;
        _questionRepository = questionRepository;
    }

    public async Task Handle(UpdateUserStatisticsCommand request, CancellationToken cancellationToken)
    {
        Console.WriteLine("UpdateUserStatisticsCommandHandler Called");
        var submission = request.Submission;
        var question = await _questionRepository.GetByIdAsync( submission.QuestionId, cancellationToken);
        if (question is null)
        {
            throw new InvalidOperationException("Question not found.");
        }
        
        var statistics = await _repository.GetByUserIdAsync(submission.UserId, cancellationToken);
        if (statistics is null)
        {
            statistics = new Domain.Entities.UserStatistics
            {
                UserId = submission.UserId
            };

            await _repository.CreateAsync(statistics, cancellationToken);

            statistics = await _repository.GetByUserIdAsync(submission.UserId, cancellationToken);
            if (statistics is null)
            {
                throw new InvalidOperationException("Unable to create user statistics.");
            }
        }

        statistics.TotalSubmissions++;

        if (submission.Status == SubmissionStatus.Accepted)
        {
            statistics.AcceptedSubmissions++;
            statistics.QuestionsSolved++;
            if (question!.QuestionType == QuestionType.mcq)
            {
                statistics.McqSolved++;
            }
            else
            {
                statistics.CodingSolved++;
            }
        }
        else
        {
            statistics.FailedSubmissions++;
        }

        statistics.TotalTimeSpentMinutes += submission.ExecutionTimeMs.HasValue ? submission.ExecutionTimeMs.Value / 60000 : 0;
        await _repository.UpdateAsync(statistics, cancellationToken);
    }
}