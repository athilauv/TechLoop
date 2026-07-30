using MediatR;
using TechLoop.Application.Feature.Judge0.DTOs;

namespace TechLoop.Application.Judge0.Queries.GetSubmissionResult;

public sealed record GetSubmissionResultQuery(string Token ) : IRequest<Judge0ResultResponse?>;