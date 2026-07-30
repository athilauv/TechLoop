using MediatR;
using TechLoop.Application.Interfaces.Repositories;

namespace TechLoop.Application.Features.Mentor.Commands.DeleteMentor;

public sealed class DeleteMentorCommandHandler : IRequestHandler<DeleteMentorCommand>
{
    private readonly IMentorRepository _repository;
    public DeleteMentorCommandHandler(IMentorRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(DeleteMentorCommand request, CancellationToken cancellationToken)
    {
        var mentor = await _repository.GetByIdAsync(request.MentorId, cancellationToken);
        if (mentor is null)
        {
            throw new Exception("Mentor not found.");
        }

        await _repository.DeleteAsync(request.MentorId, DateTimeOffset.UtcNow, cancellationToken);
    }
}