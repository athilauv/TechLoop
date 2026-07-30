using MediatR;
using TechLoop.Application.Features.Mentor.DTOs;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Mentor.Queries.Admin.GetMentorById;

public sealed class GetMentorByIdQueryHandler : IRequestHandler<GetMentorByIdQuery, MentorAdminResponse?>
{
    private readonly IMentorRepository _repository;

    public GetMentorByIdQueryHandler(IMentorRepository repository)
    {
        _repository = repository;
    }

    public async Task<MentorAdminResponse?> Handle(GetMentorByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetByIdAsync(request.MentorId, cancellationToken);
    }
}