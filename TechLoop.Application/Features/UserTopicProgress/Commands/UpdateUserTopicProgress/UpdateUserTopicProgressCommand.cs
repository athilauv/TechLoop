using MediatR;
using TechLoop.Domain.Entities;

namespace TechLoop.Application.Features.UserTopicProgress.UpdateUserTopicProgress;

public sealed record UpdateUserTopicProgressCommand(Submission Submission, Question Question ) : IRequest;