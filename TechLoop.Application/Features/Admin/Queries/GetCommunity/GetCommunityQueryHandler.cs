using MediatR;
using TechLoop.Application.Features.Community.CommunityPosts.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Admin.Queries.GetCommunity;

public sealed class GetCommunityQueryHandler : IRequestHandler<GetCommunityQuery, IEnumerable<CommunityPostDto>>
{
    private readonly ICommunityPostRepository _repository;

    public GetCommunityQueryHandler(ICommunityPostRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<CommunityPostDto>> Handle(GetCommunityQuery request, CancellationToken cancellationToken)
    {
        return _repository.GetFeedAsync();
    }
}
