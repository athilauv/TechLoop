using Dapper;
using TechLoop.Application.Features.SubTopics.DTOs;
using TechLoop.Application.Interfaces.Infrastructure;
using TechLoop.Application.Interfaces.Repositories;
using TechLoop.Domain.Entities;

namespace TechLoop.Infrastructure.Repositories;

public sealed class SubTopicsRepository : ISubTopicsRepository
{
    private readonly IDapperContext _context;

    private async Task<T> WithConnection<T>(Func<System.Data.IDbConnection, Task<T>> action)
    {
        using var connection = _context.CreateConnection();
        return await action(connection);
    }

    private async Task WithConnection(Func<System.Data.IDbConnection, Task> action)
    {
        using var connection = _context.CreateConnection();
        await action(connection);
    }

    public SubTopicsRepository(IDapperContext context)
    {
        _context = context;
    }

    // Check whether a subtopic already exists.
    public Task<bool> SubTopicIdExistsAsync(int subTopicId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition("SELECT fn_subtopic_id_exists(@SubTopicId);",
                    new
                    {
                        SubTopicId = subTopicId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Check whether a subtopic with the same slug already exists within the topic.
    public Task<bool> ExistsAsync(int topicId, string slug, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.ExecuteScalarAsync<bool>(
                new CommandDefinition("SELECT fn_subtopic_exists(@TopicId,@Slug);",
                    new
                    {
                        TopicId = topicId,
                        Slug = slug
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Check whether the subtopic slug already exists.
    public Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.ExecuteScalarAsync<bool>(
                new CommandDefinition("SELECT fn_subtopic_slug_exists(@Slug);",
                    new
                    {
                        Slug = slug
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Check whether the position already exists within the topic.
    public Task<bool> PositionExistsAsync( int topicId, int position, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        

            return await connection.ExecuteScalarAsync<bool>(new CommandDefinition("SELECT fn_subtopic_position_exists(@TopicId,@Position);",
                    new
                    {
                        TopicId = topicId,
                        Position = position
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Create a new subtopic.
    public Task<int> CreateAsync(SubTopic subTopic, bool shiftPositions, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        

            await connection.ExecuteAsync(
                new CommandDefinition(
                    @"CALL public.sp_manage_subtopic(
                        'CREATE',
                        NULL,
                        @TopicId,
                        @ParentSubTopicId,
                        @Slug,
                        @Title,
                        @Description,
                        @ImageUrl,
                        @Example,
                        @ExampleType,
                        @Position,
                        @CreatedBy,
                        NULL,
                        NULL,
                        NULL,
                        @ShiftPositions);",
                    new
                    {
                        subTopic.TopicId,
                        subTopic.ParentSubTopicId,
                        subTopic.Slug,
                        subTopic.Title,
                        subTopic.Description,
                        subTopic.ImageUrl,
                        subTopic.Example,
                        subTopic.ExampleType,
                        subTopic.Position,
                        subTopic.CreatedBy,
                        ShiftPositions = shiftPositions
                    },
                    cancellationToken: cancellationToken));

            return 1;
    
    });
    }

    // Update an existing subtopic.
    public Task<int> UpdateAsync(SubTopic subTopic, bool shiftPositions, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        

            await connection.ExecuteAsync(
                new CommandDefinition(
                    @"CALL public.sp_manage_subtopic(
                        'UPDATE',
                        @Id,
                        @TopicId,
                        @ParentSubTopicId,
                        @Slug,
                        @Title,
                        @Description,
                        @ImageUrl,
                        @Example,
                        @ExampleType,
                        @Position,
                        NULL,
                        @UpdatedBy,
                        NULL,
                        NULL,
                        @ShiftPositions);",
                    new
                    {
                        subTopic.Id,
                        subTopic.TopicId,
                        subTopic.ParentSubTopicId,
                        subTopic.Slug,
                        subTopic.Title,
                        subTopic.Description,
                        subTopic.ImageUrl,
                        subTopic.Example,
                        subTopic.ExampleType,
                        subTopic.Position,
                        subTopic.UpdatedBy,
                        ShiftPositions = shiftPositions
                    },
                    cancellationToken: cancellationToken));

            return 1;
    
    });
    }

    // Soft delete a subtopic.
    public Task<int> SoftDeleteAsync(int id, Guid deletedBy, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            await connection.ExecuteAsync(new CommandDefinition(
                @"CALL public.sp_manage_subtopic(
                    'DELETE', @Id, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
                    NULL, NULL, @DeletedBy, NULL, FALSE);",
                new { Id = id, DeletedBy = deletedBy },
                cancellationToken: cancellationToken));

            return 1;
    
    });
    }
    
    // Check whether the topic exists.
    public Task<bool> TopicExistsAsync(int topicId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.ExecuteScalarAsync<bool>(
                new CommandDefinition("SELECT fn_subtopic_topic_exists(@TopicId);",
                    new
                    {
                        TopicId = topicId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Publish a subtopic.
    public Task<int> PublishAsync(SubTopic subTopic, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            await connection.ExecuteAsync(new CommandDefinition(
                @"CALL public.sp_manage_subtopic(
                    'PUBLISH', @Id, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
                    NULL, NULL, NULL, @PublishedBy, FALSE);",
                new { subTopic.Id, PublishedBy = subTopic.PublishedBy },
                cancellationToken: cancellationToken));

            return 1;
    
    });
    }

    // Get a subtopic by its ID.
    public Task<SubTopic?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QuerySingleOrDefaultAsync<SubTopic>(
                new CommandDefinition("SELECT * FROM fn_get_subtopic_by_id(@Id);",
                    new
                    {
                        Id = id
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<MentorSubTopicResponse?> GetMentorByIdAsync(int id, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QuerySingleOrDefaultAsync<MentorSubTopicResponse>(
                new CommandDefinition(
                    "SELECT * FROM fn_get_mentor_subtopic_by_id(@Id);",
                    new { Id = id },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get all active subtopics.
    public Task<IEnumerable<SubTopic>> GetAllAsync(CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QueryAsync<SubTopic>(
                new CommandDefinition("SELECT * FROM fn_get_all_subtopics();",
                    cancellationToken: cancellationToken));
    
    });
    }

    public Task<IEnumerable<MentorSubTopicResponse>> GetAllMentorAsync(Guid mentorId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QueryAsync<MentorSubTopicResponse>(
                new CommandDefinition(
                    "SELECT * FROM fn_get_mentor_subtopics(@MentorId);",
                    new { MentorId = mentorId },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get all published subtopics.
    public Task<IEnumerable<SubTopic>> GetPublishedAsync(CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QueryAsync<SubTopic>(
                new CommandDefinition("SELECT * FROM fn_get_published_subtopics();",
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get a published subtopic by its slug.
    public Task<SubTopic?> GetPublishedBySlugAsync(string slug, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QuerySingleOrDefaultAsync<SubTopic>(
                new CommandDefinition(
                    "SELECT * FROM fn_get_published_subtopic_by_slug(@Slug);",
                    new
                    {
                        Slug = slug
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get the technology ID associated with the subtopic.
    public Task<int?> GetTechnologyIdAsync(int subTopicId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.ExecuteScalarAsync<int?>(
                new CommandDefinition("SELECT fn_get_subtopic_technology(@SubTopicId);",
                    new
                    {
                        SubTopicId = subTopicId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get the technology ID associated with the mentor.
    public Task<int?> GetMentorTechnologyIdAsync(Guid userId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        

            return await connection.ExecuteScalarAsync<int?>(
                new CommandDefinition("SELECT fn_get_mentor_technology(@UserId);",
                    new
                    {
                        UserId = userId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get the topic ID associated with the subtopic.
    public Task<int> GetTopicIdAsync(int subTopicId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.ExecuteScalarAsync<int>(
                new CommandDefinition("SELECT fn_get_topic_id(@SubTopicId);",
                    new
                    {
                        SubTopicId = subTopicId
                    },
                    cancellationToken: cancellationToken));
    
    });
    }

    // Get unpublished subtopics for a mentor.
    public Task<IEnumerable<MentorSubTopicResponse>>
        GetUnpublishedSubTopicsForMentorAsync(Guid mentorId, CancellationToken cancellationToken)
    {
    return WithConnection(async connection =>
    {
        
            return await connection.QueryAsync<MentorSubTopicResponse>(
                new CommandDefinition(
                    "SELECT * FROM fn_get_mentor_unpublished_subtopic_details(@MentorId);",
                    new { MentorId = mentorId },
                    cancellationToken: cancellationToken));
    
    });
    }
}
