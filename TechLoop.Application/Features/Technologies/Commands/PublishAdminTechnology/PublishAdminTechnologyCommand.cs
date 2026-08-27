using MediatR;
using TechLoop.Application.Features.Technologies.DTOs;

namespace TechLoop.Application.Features.Technologies.Commands.PublishAdminTechnology;

public sealed record PublishAdminTechnologyCommand(int Id, Guid PublishedBy) : IRequest<PublishTechnologyResponse>;
