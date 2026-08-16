using MediatR;
using TechLoop.Application.Features.TopicContributions.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TopicContributions.Queries.Mentor.GetMentorTopicContributionById;

public sealed class GetMentorTopicContributionByIdQueryHandler : IRequestHandler<GetMentorTopicContributionByIdQuery, TopicContributionResponse?>
{
    private readonly ITopicContributionRepository _repository;
    public GetMentorTopicContributionByIdQueryHandler(ITopicContributionRepository repository)
    {
        _repository = repository;
    }

    public async Task<TopicContributionResponse?> Handle(GetMentorTopicContributionByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMentorContributionByIdAsync(request.MentorId, request.ContributionId, cancellationToken);
    }
}