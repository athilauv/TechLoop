using TechLoop.Application.Features.Lookups.DTOs;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ILookupRepository
{
    Task<IEnumerable<LookupOptionResponse>> GetDifficultyLevelsAsync(CancellationToken cancellationToken);
    Task<IEnumerable<LookupOptionResponse>> GetQuestionTypesAsync(CancellationToken cancellationToken);
    Task<IEnumerable<LookupOptionResponse>> GetExampleTypesAsync(CancellationToken cancellationToken);
}
