using TechLoop.Domain.Entities;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ISubmissionExecutionService
{
    Task ExecuteAsync(Submission submission, Question question, CancellationToken cancellationToken);
}