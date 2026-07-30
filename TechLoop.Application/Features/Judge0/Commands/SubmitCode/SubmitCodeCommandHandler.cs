using MediatR;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;

namespace TechLoop.Application.Judge0.Commands.SubmitCode;

public sealed class SubmitCodeCommandHandler : IRequestHandler<SubmitCodeCommand, Judge0SubmissionResponse?>
{
    private readonly IJudge0Service _judge0Service;
    public SubmitCodeCommandHandler(IJudge0Service judge0Service)
    {
        _judge0Service = judge0Service;
    }

    public async Task<Judge0SubmissionResponse?> Handle(SubmitCodeCommand request, CancellationToken cancellationToken)
    {
        return await _judge0Service.SubmitAsync(request.Request, cancellationToken);
    }
}