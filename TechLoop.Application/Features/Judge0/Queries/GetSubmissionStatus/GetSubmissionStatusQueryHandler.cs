// using MediatR;
// using TechLoop.Application.DTOs.Judge0;
// using TechLoop.Application.Interfaces.Infrastructure;
//
// namespace TechLoop.Application.Judge0.Queries.GetSubmissionStatus;
//
// public sealed class GetSubmissionStatusQueryHandler
//     : IRequestHandler<GetSubmissionStatusQuery, Judge0ResultResponse?>
// {
//     private readonly IJudge0Service _judge0Service;
//
//     public GetSubmissionStatusQueryHandler(IJudge0Service judge0Service)
//     {
//         _judge0Service = judge0Service;
//     }
//
//     public async Task<Judge0ResultResponse?> Handle(
//         GetSubmissionStatusQuery request,
//         CancellationToken cancellationToken)
//     {
//         return await _judge0Service.GetResultAsync(
//             request.Token,
//             cancellationToken);
//     }
// }