using MediatR;
using TechLoop.Application.Common.Caching;
using TechLoop.Application.Features.Topics.DTOs;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Application.Interfaces.Services;

namespace TechLoop.Application.Features.Topics.Commands.DeleteTopic;

public sealed class DeleteTopicCommandHandler : IRequestHandler<DeleteTopicCommand, DeleteTopicResponse>
{
    private readonly ITopicsRepository _repository;
    private readonly ICurrentUserService _currentUser;
    private readonly ICacheService _cache;

    public DeleteTopicCommandHandler(ITopicsRepository repository, ICurrentUserService currentUser, ICacheService cache)
    {
        _repository = repository;
        _currentUser = currentUser;
        _cache = cache;
    }

    public async Task<DeleteTopicResponse> Handle(
        DeleteTopicCommand request,
        CancellationToken cancellationToken)
    {
        var topic = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (topic is null)
        {
            throw new KeyNotFoundException("Topic not found.");
        }

        await _repository.SoftDeleteAsync(request.Id, _currentUser.UserId, cancellationToken);
        await _cache.RemoveAsync(CacheKeys.Topics);
        await _cache.RemoveAsync(CacheKeys.TopicBySlug(topic.Slug));
        await _cache.RemoveAsync(CacheKeys.Curriculum(topic.TechnologyId));

        return new DeleteTopicResponse
        {
            Success = true,
            Message = "Topic deleted successfully."
        };
    }
}