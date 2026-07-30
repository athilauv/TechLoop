using TechLoop.Application.Features.Curriculum.DTOs;

namespace TechLoop.Application.Interfaces.Repositories;

public interface ICurriculumRepository
{
    // Mentor's technology with all topics & subtopics
    Task<MentorCurriculumResponse?> GetMentorCurriculumAsync(Guid userId, CancellationToken cancellationToken);
    // Published curriculum for learner
    Task<LearnerCurriculumResponse?> GetLearnerCurriculumAsync(int technologyId, CancellationToken cancellationToken);
}