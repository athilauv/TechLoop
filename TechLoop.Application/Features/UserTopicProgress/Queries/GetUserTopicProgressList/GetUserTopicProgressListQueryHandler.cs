using MediatR;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.UserTopicProgress.Queries.GetUserTopicProgressList;

public sealed class GetUserTopicProgressListQueryHandler : IRequestHandler<GetUserTopicProgressListQuery, IEnumerable<GetUserTopicProgressListResponse>>
{
    private readonly IUserTopicProgressRepository _repository;
    public GetUserTopicProgressListQueryHandler(IUserTopicProgressRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<GetUserTopicProgressListResponse>> Handle(GetUserTopicProgressListQuery request, CancellationToken cancellationToken)
    {
        var progressList = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);
        return progressList.Select(progress => new GetUserTopicProgressListResponse
        {
            Id = progress.Id,
            UserId = progress.UserId,
            TopicId = progress.TopicId,
            CompletedQuestions = progress.CompletedQuestions,
            LastPracticedAt = progress.LastPracticedAt,
            CreatedAt = progress.CreatedAt,
            UpdatedAt = progress.UpdatedAt
        });
    }
}