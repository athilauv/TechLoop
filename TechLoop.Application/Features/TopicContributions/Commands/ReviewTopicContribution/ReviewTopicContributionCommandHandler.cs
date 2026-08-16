using MediatR;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TopicContributions.Commands.ReviewTopicContribution;

public sealed class ReviewTopicContributionCommandHandler : IRequestHandler<ReviewTopicContributionCommand, bool>
{
    private readonly ITopicContributionRepository _repository;

    public ReviewTopicContributionCommandHandler(ITopicContributionRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(ReviewTopicContributionCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Request;
        return await _repository.ReviewAsync(
            contributionId: dto.Id,
            status: dto.Status,
            reviewNotes: dto.ReviewNotes,
            position: dto.Position,
            parentSubTopicId: dto.ParentSubTopicId,
            reviewedBy: request.ReviewerId,
            cancellationToken);
    }
}