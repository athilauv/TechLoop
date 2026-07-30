using MediatR;
using TechLoop.Application.Feature.Judge0.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;

namespace TechLoop.Application.Judge0.Queries.GetSubmissionResult;

public sealed class GetSubmissionResultQueryHandler : IRequestHandler<GetSubmissionResultQuery, Judge0ResultResponse?>
{
    private readonly IJudge0Service _judge0Service;
    public GetSubmissionResultQueryHandler(IJudge0Service judge0Service)
    {
        _judge0Service = judge0Service;
    }

    public async Task<Judge0ResultResponse?> Handle(GetSubmissionResultQuery request, CancellationToken cancellationToken)
    {
        return await _judge0Service.GetResultAsync(request.Token, cancellationToken);
    }
}