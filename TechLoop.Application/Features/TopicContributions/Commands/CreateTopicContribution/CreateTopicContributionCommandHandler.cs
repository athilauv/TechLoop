using MediatR;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.TopicContributions.Commands.CreateTopicContribution;
public sealed class CreateTopicContributionCommandHandler : IRequestHandler<CreateTopicContributionCommand, int>
{
    private readonly ITopicContributionRepository _repository;

    public CreateTopicContributionCommandHandler(ITopicContributionRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(CreateTopicContributionCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Request;
        var technologyExists = await _repository.TechnologyExistsAsync(dto.TechnologyId, cancellationToken);
        if (!technologyExists)
        {
            throw new InvalidOperationException("Technology not found.");
        }

        return await _repository.CreateAsync(
            learnerId: request.LearnerId,
            technologyId: dto.TechnologyId,
            topicId: dto.TopicId,
            subTopicId: dto.SubTopicId,
            title: dto.Title,
            description: dto.Description,
            example: dto.Example,
            exampleType: dto.ExampleType,
            referenceUrl: dto.ReferenceUrl,
            cancellationToken);
    }
}