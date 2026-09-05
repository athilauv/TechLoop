using Dapper;
using TechLoop.Application.Common.Pagination;
using TechLoop.Application.Features.Questions.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class QuestionRepository : IQuestionRepository
{
    private readonly IDapperContext _context;
    public QuestionRepository(IDapperContext context)
    {
        _context = context;
    }

    private async Task<T> WithConnection<T>(
        Func<System.Data.IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    private async Task WithConnection(Func<System.Data.IDbConnection, Task> action)
    {
        using var connection = _context.CreateConnection();
        await action(connection);
    }

    public Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_slug_exists(@Slug);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(sql, new { Slug = slug },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> PositionExistsAsync(int subTopicId, int position, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_position_exists(@SubTopicId, @Position);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(sql, new { SubTopicId = subTopicId, Position = position },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> SubTopicExistsAsync(int subTopicId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_subtopic_exists(@SubTopicId);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(sql, new { SubTopicId = subTopicId }, cancellationToken: cancellationToken)));
    }

    public Task<int> CreateAsync(Question question, bool shiftPositions, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_question(
                @SubTopicId,
                CAST(@QuestionType AS smallint),
                @Slug,
                @Title,
                @Description,
                @ImageUrl,
                @Mark,
                @Hint,
                @Explanation,
                @TimeLimitSeconds,
                @MemoryLimitMb,
                CAST(@Difficulty AS smallint),
                @Position,
                @CreatedBy,
                @CreatedAt,
                @ShiftPositions
            );";

        return WithConnection(connection => connection.ExecuteScalarAsync<int>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        question.SubTopicId,
                        question.QuestionType,
                        question.Slug,
                        question.Title,
                        question.Description,
                        question.ImageUrl,
                        question.Mark,
                        question.Hint,
                        question.Explanation,
                        question.TimeLimitSeconds,
                        question.MemoryLimitMb,
                        question.Difficulty,
                        question.Position,
                        question.CreatedBy,
                        question.CreatedAt,
                        ShiftPositions = shiftPositions
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<Question?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_question_by_id(@Id);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<Question>(
                new CommandDefinition(sql,
                    new { Id = id },
                    cancellationToken: cancellationToken)));
    }

    public Task<Question?> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_question_by_slug(@Slug);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<Question>(
                new CommandDefinition(sql,
                    new { Slug = slug },
                    cancellationToken: cancellationToken)));
    }

    public async Task<int> UpdateAsync(Question question, bool shiftPositions, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_update_question(
    @Id,
    @SubTopicId,
    CAST(@QuestionType AS smallint),
    @Slug,
    @Title,
    @Description,
    @ImageUrl,
    @Mark,
    @Hint,
    @Explanation,
    @TimeLimitSeconds,
    @MemoryLimitMb,
    CAST(@Difficulty AS smallint),
    @Position,
    @UpdatedBy,
    @UpdatedAt,
    @ShiftPositions
);";

        await WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(sql,
                    new
                    {
                        question.Id,
                        question.SubTopicId,
                        question.QuestionType,
                        question.Slug,
                        question.Title,
                        question.Description,
                        question.ImageUrl,
                        question.Mark,
                        question.Hint,
                        question.Explanation,
                        question.TimeLimitSeconds,
                        question.MemoryLimitMb,
                        question.Difficulty,
                        question.Position,
                        question.UpdatedBy,
                        question.UpdatedAt,
                        ShiftPositions = shiftPositions
                    },
                    cancellationToken: cancellationToken)));

        return await WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition("SELECT fn_question_exists(@Id);",
                    new { question.Id }, cancellationToken: cancellationToken))) ? 1 : 0;
    }

    public async Task<int> SoftDeleteAsync( int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql =@"CALL sp_soft_delete_question(@Id, @DeletedBy, @DeletedAt);";
        await WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(sql, new
                    { Id = id, DeletedBy = deletedBy, DeletedAt = DateTime.UtcNow },
                    cancellationToken: cancellationToken)));

        var stillExists = await WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(
                    "SELECT fn_question_exists(@Id);",
                    new { Id = id },
                    cancellationToken: cancellationToken)));

        return stillExists ? 0 : 1;
    }

    public Task<PagedResult<Question>> GetAllAsync(
        int page,
        int pageSize,
        short? questionType,
        short? difficulty,
        int? subTopicId,
        string? search,
        bool? published,
        string? sort,
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_all_questions(
                @Page, @PageSize, @QuestionType, @Difficulty,
                @SubTopicId, @Search, @Published, @Sort);";

        return WithConnection(async connection =>
        {
            var rows = (
                await connection.QueryAsync<QuestionPagedRow>(
                    new CommandDefinition(sql, new
                        {
                            Page = page,
                            PageSize = pageSize,
                            QuestionType = questionType,
                            Difficulty = difficulty,
                            SubTopicId = subTopicId,
                            Search = search,
                            Published = published,
                            Sort = sort
                        },
                        cancellationToken: cancellationToken))
            ).ToList();

            return new PagedResult<Question>
            {
                Items = rows.Cast<Question>().ToList(),
                Page = page,
                PageSize = pageSize,
                TotalItems = rows.FirstOrDefault()?.TotalItems ?? 0
            };
        });
    }

    public Task<PagedResult<Question>> GetAllMentorAsync(
        Guid mentorId,
        int page,
        int pageSize,
        int? difficulty,
        int? subTopicId,
        short? questionType,
        string? search,
        string? sort,
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_mentor_questions(
                @MentorId,
                @Page,
                @PageSize,
                @Difficulty,
                @SubTopicId,
                @QuestionType,
                @Search,
                @Sort
            );";

        return WithConnection(async connection =>
        {
            var rows = (
                await connection.QueryAsync<QuestionPagedRow>(
                    new CommandDefinition(
                        sql,
                        new
                        {
                            MentorId = mentorId,
                            Page = page,
                            PageSize = pageSize,
                            Difficulty = difficulty,
                            SubTopicId = subTopicId,
                            QuestionType = questionType,
                            Search = search,
                            Sort = sort
                        },
                        cancellationToken: cancellationToken))
            ).ToList();

            return new PagedResult<Question>
            {
                Items = rows.Cast<Question>().ToList(),
                Page = page,
                PageSize = pageSize,
                TotalItems = rows.FirstOrDefault()?.TotalItems ?? 0
            };
        });
    }

    private sealed class QuestionPagedRow : Question
    {
        public int TotalItems { get; set; }
    }

    public Task<int> PublishAsync(
        Question question,
        CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_publish_question(@Id, @PublishedBy, @PublishedAt);";
        return WithConnection(connection => connection.ExecuteAsync(
                new CommandDefinition(sql,
                    new { question.Id, question.PublishedBy, question.PublishedAt },
                    cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<Question>> GetPublishedAsync(CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_questions();";
        return WithConnection(connection => connection.QueryAsync<Question>(
                new CommandDefinition(sql, cancellationToken: cancellationToken)));
    }

    public Task<Question?> GetPublishedByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_question_by_id(@Id);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<Question>(
                new CommandDefinition(sql, new { Id = id },
                    cancellationToken: cancellationToken)));
    }

    public Task<Question?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_question_by_slug(@Slug);";
        return WithConnection(connection => connection.QuerySingleOrDefaultAsync<Question>(
                new CommandDefinition(sql, new { Slug = slug }, 
                    cancellationToken: cancellationToken)));
    }

    public Task<int> GetMcqOptionCountAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_get_mcq_option_count(@QuestionId);";
        return WithConnection(connection => connection.ExecuteScalarAsync<int>(
                new CommandDefinition(sql, new { QuestionId = questionId },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> HasCodingTemplateAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_has_coding_template(@QuestionId);";
        return WithConnection(connection => connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(sql, new { QuestionId = questionId },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> HasTestCasesAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_has_test_cases(@QuestionId);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(sql,
                    new { QuestionId = questionId },
                    cancellationToken: cancellationToken)));
    }

    public Task<int?> GetQuestionTechnologyIdAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_get_question_technology(@QuestionId);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int?>(new CommandDefinition(sql,
                    new { QuestionId = questionId }, cancellationToken: cancellationToken)));
    }

    public Task<int?> GetMentorTechnologyIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        const string sql =
            @"SELECT fn_get_mentor_technology(@UserId);";

        return WithConnection(connection =>
            connection.ExecuteScalarAsync<int?>(
                new CommandDefinition(
                    sql,
                    new { UserId = userId },
                    cancellationToken: cancellationToken)));
    }

    public Task<bool> ExistsAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_exists(@Id);";
        return WithConnection(connection =>
            connection.ExecuteScalarAsync<bool>(
                new CommandDefinition(sql, new { Id = id }, cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<LearnerCodingQuestionDto>> GetCodingQuestionsAsync(
        int page,
        int pageSize,
        int? technologyId,
        int? difficulty,
        int? subTopicId,
        string? search,
        string? sort,
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_coding_questions(@Page, @PageSize, @TechnologyId, @Difficulty, @SubTopicId, @Search, @Sort);";
        return WithConnection(connection =>
            connection.QueryAsync<LearnerCodingQuestionDto>( new CommandDefinition( sql,
                    new
                    {
                        Page = page,
                        PageSize = pageSize,
                        TechnologyId = technologyId,
                        Difficulty = difficulty,
                        SubTopicId = subTopicId,
                        Search = search,
                        Sort = sort
                    },
                    cancellationToken: cancellationToken)));
    }

    public Task<IEnumerable<Question>> GetPublishedMcqQuestionsBySubTopicAsync( int subTopicId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_mcq_question_by_subtopic(@SubTopicId);";

        return WithConnection(connection =>
            connection.QueryAsync<Question>( new CommandDefinition(
                    sql, new { SubTopicId = subTopicId }, cancellationToken: cancellationToken)));
    }
}