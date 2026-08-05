using MediatR;
using TechLoop.Application.Common.Exceptions;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgress;

public sealed class GetUserTopicProgressQueryHandler : IRequestHandler<GetUserTopicProgressQuery, GetUserTopicProgressResponse>
{
    private readonly IUserTopicProgressRepository _repository;
    public GetUserTopicProgressQueryHandler(IUserTopicProgressRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetUserTopicProgressResponse> Handle(GetUserTopicProgressQuery request, CancellationToken cancellationToken)
    {
        var progress = await _repository.GetByUserAndTopicAsync(request.UserId, request.TopicId, cancellationToken);
        if (progress is null)
        {
            throw new NotFoundException("User topic progress not found.");
        }

        return new GetUserTopicProgressResponse
        {
            Id = progress.Id,
            UserId = progress.UserId,
            TopicId = progress.TopicId,
            CompletedQuestions = progress.CompletedQuestions,
            LastPracticedAt = progress.LastPracticedAt,
            CreatedAt = progress.CreatedAt,
            UpdatedAt = progress.UpdatedAt
        };
    }
}