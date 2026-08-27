using Dapper;
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

    // Checks if the specified slug already exists
    public async Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_slug_exists(@Slug);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                sql,
                new
                {
                    Slug = slug
                },
                cancellationToken: cancellationToken));
    }

    // Checks if the specified position is already assigned within the subtopic
    public async Task<bool> PositionExistsAsync(int subTopicId, int position, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_position_exists(@SubTopicId, @Position);";

        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(
            new CommandDefinition(
                sql,
                new
                {
                    SubTopicId = subTopicId,
                    Position = position
                },
                cancellationToken: cancellationToken));
    }

    // Checks if the specified subtopic exists
    public async Task<bool> SubTopicExistsAsync(int subTopicId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_subtopic_exists(@SubTopicId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                new
                {
                    SubTopicId = subTopicId
                },
                cancellationToken: cancellationToken));
    }

    // Creates a new question and returns the generated ID
    public async Task<int> CreateAsync(Question question, bool shiftPositions, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_create_question(@SubTopicId,@QuestionType,@Slug,@Title,@Description,@ImageUrl,@Mark,@Hint,@Explanation,@TimeLimitSeconds,@MemoryLimitMb,@Difficulty,@Position,@CreatedBy,@CreatedAt,@ShiftPositions);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(sql, new { question.SubTopicId, question.QuestionType, question.Slug, question.Title, question.Description, question.ImageUrl, question.Mark, question.Hint, question.Explanation, question.TimeLimitSeconds, question.MemoryLimitMb, question.Difficulty, question.Position, question.CreatedBy, question.CreatedAt, ShiftPositions = shiftPositions }, cancellationToken: cancellationToken));
    }

    // Retrieves a question by its ID
    public async Task<Question?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_question_by_id(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Question>(new CommandDefinition(sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }

    // Updates the specified question
    public async Task<int> UpdateAsync(Question question, bool shiftPositions, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_update_question(@Id, @SubTopicId, @QuestionType, @Slug, @Title, @Description, @ImageUrl, @Mark, @Hint, @Explanation, @TimeLimitSeconds, @MemoryLimitMb, @Difficulty, @Position, @UpdatedBy, @UpdatedAt, @ShiftPositions);";
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(new CommandDefinition(
            sql,
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
            cancellationToken: cancellationToken));

        var updated = await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
            "SELECT fn_question_exists(@Id);",
            new { question.Id },
            cancellationToken: cancellationToken));

        return updated ? 1 : 0;
    }

    // Soft deletes the specified question
    public async Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_soft_delete_question(@Id, @DeletedBy, @DeletedAt);";
        using var connection = _context.CreateConnection();
        await connection.ExecuteAsync(
            new CommandDefinition(sql,
                new
                {
                    Id = id,
                    DeletedBy = deletedBy,
                    DeletedAt = DateTime.UtcNow
                },
                cancellationToken: cancellationToken));

        var stillExists = await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
            "SELECT fn_question_exists(@Id);",
            new { Id = id },
            cancellationToken: cancellationToken));

        return stillExists ? 0 : 1;
    }

    // Retrieves all active questions
    public async Task<IEnumerable<Question>> GetAllAsync(CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_all_questions();";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Question>(new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    public async Task<IEnumerable<Question>> GetAllMentorAsync(
        Guid mentorId,
        CancellationToken cancellationToken)
    {
        const string sql = @"
            SELECT q.*
            FROM fn_get_all_questions() q
            INNER JOIN sub_topics st
                ON st.id = q.sub_topic_id
                AND st.deleted_at IS NULL
            INNER JOIN topics t
                ON t.id = st.topic_id
                AND t.deleted_at IS NULL
            INNER JOIN mentor mentor_user
                ON mentor_user.technology_id = t.technology_id
                AND mentor_user.user_id = @MentorId
                AND mentor_user.deleted_at IS NULL;";

        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Question>(
            new CommandDefinition(
                sql,
                new { MentorId = mentorId },
                cancellationToken: cancellationToken));
    }


    // Publishes the specified question
    public async Task<int> PublishAsync(
        Question question,
        CancellationToken cancellationToken)
    {
        const string sql = @"CALL sp_publish_question(@Id, @PublishedBy, @PublishedAt);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    question.Id,
                    question.PublishedBy,
                    question.PublishedAt
                },
                cancellationToken: cancellationToken));
    }

    // Retrieves all published questions
    public async Task<IEnumerable<Question>> GetPublishedAsync(
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_questions();";
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<Question>(new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    // Retrieves a published question by its ID
    public async Task<Question?> GetPublishedByIdAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_question_by_id(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Question>(
            new CommandDefinition(sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }
   
    // Returns the number of active MCQ options for a question
    public async Task<int> GetMcqOptionCountAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_get_mcq_option_count(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(
                sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }
    
    // Checks whether the coding question has at least one template
    public async Task<bool> HasCodingTemplateAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_has_coding_template(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }
   
    // Checks whether the coding question has at least one test case
    public async Task<bool> HasTestCasesAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_has_test_cases(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
                sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }
    
    // Returns the technology of the question
    public async Task<int?> GetQuestionTechnologyIdAsync(int questionId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_get_question_technology(@QuestionId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int?>(new CommandDefinition(sql,
                new
                {
                    QuestionId = questionId
                },
                cancellationToken: cancellationToken));
    }
    
    // Returns the technology assigned to the logged-in mentor
    public async Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_get_mentor_technology(@UserId);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<int?>(new CommandDefinition(
                sql,
                new
                {
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }
  
    public async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT fn_question_exists(@Id);";
        using var connection = _context.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }
    
    public async Task<IEnumerable<LearnerCodingQuestionDto>> GetCodingQuestionsAsync(
        int page,
        int pageSize,
        int? technologyId,
        int? difficulty,
        int? subTopicId,
        string? search,
        string? sort,
        CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_coding_questions( @Page, @PageSize, @TechnologyId, @Difficulty, @SubTopicId, @Search, @Sort);";

        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<LearnerCodingQuestionDto>(new CommandDefinition(
                sql,
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
                cancellationToken: cancellationToken));
    }
    
    public async Task<Question?> GetPublishedMcqQuestionBySubTopicAsync( int subTopicId, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT * FROM fn_get_published_mcq_question_by_subtopic(@SubTopicId);";
        using var connection = _context.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Question>(new CommandDefinition(
                sql,
                new
                {
                    SubTopicId = subTopicId
                },
                cancellationToken: cancellationToken));
    }
}