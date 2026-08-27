using Microsoft.Extensions.DependencyInjection;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Infrastructure.Repositories;

namespace TechLoop.Infrastructure.DependencyInjection;

public static class RepositoryServiceCollectionExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<ITechnologyRepository, TechnologyRepository>();
        services.AddScoped<ITopicsRepository, TopicRepository>();
        services.AddScoped<ISubTopicsRepository, SubTopicsRepository>();
        services.AddScoped<ITechnologyCategoryRepository, TechnologyCategoryRepository>();
        services.AddScoped<IQuestionRepository, QuestionRepository>();
        services.AddScoped<IMcqOptionRepository, McqOptionRepository>();
        services.AddScoped<ICodingTemplateRepository, CodingTemplateRepository>();
        services.AddScoped<ITestCaseRepository, TestCaseRepository>();
        services.AddScoped<ISubmissionRepository, SubmissionRepository>();
        services.AddScoped<ICurriculumRepository, CurriculumRepository>();
        services.AddScoped<ITopicContributionRepository, TopicContributionRepository>();
        services.AddScoped<IMentorRepository, MentorRepository>();
        services.AddScoped<IUserStatisticsRepository, UserStatisticsRepository>();
        services.AddScoped<IUserTopicProgressRepository, UserTopicProgressRepository>();
        services.AddScoped<IDiscussionRepository, DiscussionRepository>();
        services.AddScoped<IDiscussionCommentRepository, DiscussionCommentRepository>();
        services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
        services.AddScoped<IAdminRepository, AdminRepository>();
        services.AddScoped<ICommunityPostRepository, CommunityPostRepository>();
        services.AddScoped<IPostCommentRepository, PostCommentRepository>();
        services.AddScoped<IPostLikeRepository, PostLikeRepository>();
        services.AddScoped<ISavedPostRepository, SavedPostRepository>();
        return services;
    }
}