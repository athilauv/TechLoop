using MediatR;
using TechLoop.Application.Features.TechnologyCategories.DTOs;

namespace TechLoop.Application.Features.TechnologyCategories.Commands.PublishTechnologyCategory;

public sealed record PublishTechnologyCategoryCommand(int Id, Guid PublishedBy) : IRequest<PublishTechnologyCategoryResponse>;