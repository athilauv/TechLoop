using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Mentor.Queries.Admin.GetAllMentors;

public sealed class GetAllMentorsQueryHandler : IRequestHandler<GetAllMentorsQuery, IEnumerable<MentorAdminResponse>>
{
    private readonly IMentorRepository _repository;
    public GetAllMentorsQueryHandler(IMentorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MentorAdminResponse>> Handle(GetAllMentorsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetAllAsync(cancellationToken);
    }
}