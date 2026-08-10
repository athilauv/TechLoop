/*=====================================================================
  QUESTION REPOSITORY
  Table : questions
=====================================================================*/


/*=====================================================================
  Repository Method : SlugExistsAsync
  Function Name     : fn_question_slug_exists
  Purpose           : Check whether the slug already exists.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_question_slug_exists
(
    p_slug TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM questions
    WHERE LOWER(slug) = LOWER(p_slug)
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : PositionExistsAsync
  Function Name     : fn_question_position_exists
  Purpose           : Check whether a position already exists inside
                      the given subtopic.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_question_position_exists
(
    p_sub_topic_id INT,
    p_position INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM questions
    WHERE sub_topic_id = p_sub_topic_id
      AND position = p_position
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : SubTopicExistsAsync
  Function Name     : fn_question_subtopic_exists
  Purpose           : Check whether the subtopic exists.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_question_subtopic_exists
(
    p_sub_topic_id INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM sub_topics
    WHERE id = p_sub_topic_id
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : CreateAsync
  Function Name     : fn_create_question
  Purpose           : Create a new question and return its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_create_question
(
    p_sub_topic_id INT,
    p_question_type SMALLINT,
    p_slug TEXT,
    p_title TEXT,
    p_description TEXT,
    p_image_url TEXT,
    p_mark INT,
    p_hint TEXT,
    p_explanation TEXT,
    p_time_limit_seconds INT,
    p_memory_limit_mb INT,
    p_difficulty SMALLINT,
    p_position INT,
    p_created_by UUID,
    p_created_at TIMESTAMPTZ
)
RETURNS INT
LANGUAGE plpgsql
AS
$$
DECLARE
    v_id INT;
BEGIN

    INSERT INTO questions
    (
        sub_topic_id,
        question_type,
        slug,
        title,
        description,
        image_url,
        mark,
        hint,
        explanation,
        time_limit_seconds,
        memory_limit_mb,
        difficulty,
        position,
        created_by,
        created_at
    )
    VALUES
    (
        p_sub_topic_id,
        p_question_type,
        p_slug,
        p_title,
        p_description,
        p_image_url,
        p_mark,
        p_hint,
        p_explanation,
        p_time_limit_seconds,
        p_memory_limit_mb,
        p_difficulty,
        p_position,
        p_created_by,
        p_created_at
    )
    RETURNING id
    INTO v_id;

    RETURN v_id;

END;
$$;

/*=====================================================================
  Repository Method : UpdateAsync
  Procedure Name    : sp_update_question
  Purpose           : Update question details.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_update_question
(
    p_id INT,
    p_sub_topic_id INT,
    p_question_type SMALLINT,
    p_slug TEXT,
    p_title TEXT,
    p_description TEXT,
    p_image_url TEXT,
    p_mark INT,
    p_hint TEXT,
    p_explanation TEXT,
    p_time_limit_seconds INT,
    p_memory_limit_mb INT,
    p_difficulty SMALLINT,
    p_position INT,
    p_updated_by UUID,
    p_updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE questions
    SET
        sub_topic_id = p_sub_topic_id,
        question_type = p_question_type,
        slug = p_slug,
        title = p_title,
        description = p_description,
        image_url = p_image_url,
        mark = p_mark,
        hint = p_hint,
        explanation = p_explanation,
        time_limit_seconds = p_time_limit_seconds,
        memory_limit_mb = p_memory_limit_mb,
        difficulty = p_difficulty,
        position = p_position,
        updated_by = p_updated_by,
        updated_at = p_updated_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : SoftDeleteAsync
  Procedure Name    : sp_soft_delete_question
  Purpose           : Soft delete a question.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_question
(
    p_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE questions
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : PublishAsync
  Procedure Name    : sp_publish_question
  Purpose           : Publish a question.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_publish_question
(
    p_id INT,
    p_published_by UUID,
    p_published_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE questions
    SET
        published_by = p_published_by,
        published_at = p_published_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;

/*=====================================================================
  Repository Method : GetByIdAsync
  Function Name     : fn_get_question_by_id
  Purpose           : Retrieve a question by its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_question_by_id
(
    p_id INT
)
RETURNS TABLE
(
    id INT,
    sub_topic_id INT,
    question_type SMALLINT,
    slug TEXT,
    title TEXT,
    description TEXT,
    image_url TEXT,
    mark INT,
    hint TEXT,
    explanation TEXT,
    time_limit_seconds INT,
    memory_limit_mb INT,
    difficulty SMALLINT,
    "position" INT,
    published_at TIMESTAMP,
    published_by UUID,
    created_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by UUID
)
LANGUAGE SQL
AS
$$
SELECT
    q.id,
    q.sub_topic_id,
    q.question_type,
    q.slug,
    q.title,
    q.description,
    q.image_url,
    q.mark,
    q.hint,
    q.explanation,
    q.time_limit_seconds,
    q.memory_limit_mb,
    q.difficulty,
    q.position,
    q.published_at,
    q.published_by,
    q.created_by,
    q.created_at,
    q.updated_at,
    q.updated_by
FROM questions q
WHERE q.id = p_id
  AND q.deleted_at IS NULL;
$$;



/*=====================================================================
  Repository Method : GetAllAsync
  Function Name     : fn_get_all_questions
  Purpose           : Get all active questions.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_all_questions()
RETURNS TABLE
(
    id INT,
    sub_topic_id INT,
    question_type SMALLINT,
    slug TEXT,
    title TEXT,
    description TEXT,
    image_url TEXT,
    mark INT,
    hint TEXT,
    explanation TEXT,
    time_limit_seconds INT,
    memory_limit_mb INT,
    difficulty SMALLINT,
    "position" INT,
    published_at TIMESTAMP,
    published_by UUID,
    created_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by UUID
)
LANGUAGE SQL
AS
$$
SELECT
    q.id,
    q.sub_topic_id,
    q.question_type,
    q.slug,
    q.title,
    q.description,
    q.image_url,
    q.mark,
    q.hint,
    q.explanation,
    q.time_limit_seconds,
    q.memory_limit_mb,
    q.difficulty,
    q.position,
    q.published_at,
    q.published_by,
    q.created_by,
    q.created_at,
    q.updated_at,
    q.updated_by
FROM questions q
WHERE q.deleted_at IS NULL
ORDER BY q.position;
$$;



/*=====================================================================
  Repository Method : GetPublishedAsync
  Function Name     : fn_get_published_questions
  Purpose           : Retrieve all published questions.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_published_questions()
RETURNS TABLE
(
    id INT,
    sub_topic_id INT,
    question_type SMALLINT,
    slug TEXT,
    title TEXT,
    description TEXT,
    image_url TEXT,
    mark INT,
    hint TEXT,
    explanation TEXT,
    time_limit_seconds INT,
    memory_limit_mb INT,
    difficulty SMALLINT,
    "position" INT,
    published_at TIMESTAMP,
    published_by UUID,
    created_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by UUID
)
LANGUAGE SQL
AS
$$
SELECT
    q.id,
    q.sub_topic_id,
    q.question_type,
    q.slug,
    q.title,
    q.description,
    q.image_url,
    q.mark,
    q.hint,
    q.explanation,
    q.time_limit_seconds,
    q.memory_limit_mb,
    q.difficulty,
    q.position,
    q.published_at,
    q.published_by,
    q.created_by,
    q.created_at,
    q.updated_at,
    q.updated_by
FROM questions q
WHERE q.published_at IS NOT NULL
  AND q.deleted_at IS NULL
ORDER BY q.position;
$$;



/*=====================================================================
  Repository Method : GetPublishedByIdAsync
  Function Name     : fn_get_published_question_by_id
  Purpose           : Retrieve a published question by its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_published_question_by_id
(
    p_id INT
)
RETURNS TABLE
(
    id INT,
    sub_topic_id INT,
    question_type SMALLINT,
    slug TEXT,
    title TEXT,
    description TEXT,
    image_url TEXT,
    mark INT,
    hint TEXT,
    explanation TEXT,
    time_limit_seconds INT,
    memory_limit_mb INT,
    difficulty SMALLINT,
    "position" INT,
    published_at TIMESTAMP,
    published_by UUID,
    created_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by UUID
)
LANGUAGE SQL
AS
$$
SELECT
    q.id,
    q.sub_topic_id,
    q.question_type,
    q.slug,
    q.title,
    q.description,
    q.image_url,
    q.mark,
    q.hint,
    q.explanation,
    q.time_limit_seconds,
    q.memory_limit_mb,
    q.difficulty,
    q.position,
    q.published_at,
    q.published_by,
    q.created_by,
    q.created_at,
    q.updated_at,
    q.updated_by
FROM questions q
WHERE q.id = p_id
  AND q.published_at IS NOT NULL
  AND q.deleted_at IS NULL;
$$;