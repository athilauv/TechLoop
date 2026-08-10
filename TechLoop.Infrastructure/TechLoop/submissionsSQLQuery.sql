CREATE OR REPLACE FUNCTION fn_create_submission
(
    p_user_id UUID,
    p_question_id INTEGER,
    p_technology_id INTEGER,
    p_source_code TEXT,
    p_status TEXT,
    p_submitted_at TIMESTAMPTZ
)
RETURNS INTEGER
LANGUAGE plpgsql
AS
$$
DECLARE
    v_submission_id INTEGER;
BEGIN

    INSERT INTO submissions
    (
        user_id,
        question_id,
        technology_id,
        source_code,
        status,
        submitted_at
    )
    VALUES
    (
        p_user_id,
        p_question_id,
        p_technology_id,
        p_source_code,
        p_status,
        p_submitted_at
    )
    RETURNING id
    INTO v_submission_id;

    RETURN v_submission_id;

END;
$$;

===========================================

CREATE OR REPLACE FUNCTION fn_get_submission_by_id
(
    p_id INTEGER
)
RETURNS TABLE
(
    id INTEGER,
    user_id UUID,
    question_id INTEGER,
    technology_id INTEGER,
    source_code TEXT,
    status TEXT,
    execution_time_ms INTEGER,
    memory_used_mb INTEGER,
    passed_test_cases INTEGER,
    total_test_cases INTEGER,
    score INTEGER,
    submitted_at TIMESTAMPTZ,
    compiler_output TEXT,
    runtime_output TEXT,
    ai_review TEXT,
    judge_token TEXT
)
LANGUAGE SQL
AS
$$
SELECT *
FROM submissions
WHERE submissions.id = p_id;
$$;

===============================================

CREATE OR REPLACE FUNCTION fn_get_user_submissions
(
    p_user_id UUID
)
RETURNS TABLE
(
    id INTEGER,
    user_id UUID,
    question_id INTEGER,
    technology_id INTEGER,
    source_code TEXT,
    status TEXT,
    execution_time_ms INTEGER,
    memory_used_mb INTEGER,
    passed_test_cases INTEGER,
    total_test_cases INTEGER,
    score INTEGER,
    submitted_at TIMESTAMPTZ,
    compiler_output TEXT,
    runtime_output TEXT,
    ai_review TEXT,
    judge_token TEXT
)
LANGUAGE SQL
AS
$$
SELECT *
FROM submissions
WHERE user_id = p_user_id
ORDER BY submitted_at DESC;
$$;

=============================================

CREATE OR REPLACE FUNCTION fn_get_question_submissions
(
    p_question_id INTEGER
)
RETURNS TABLE
(
    id INTEGER,
    user_id UUID,
    question_id INTEGER,
    technology_id INTEGER,
    source_code TEXT,
    status TEXT,
    execution_time_ms INTEGER,
    memory_used_mb INTEGER,
    passed_test_cases INTEGER,
    total_test_cases INTEGER,
    score INTEGER,
    submitted_at TIMESTAMPTZ,
    compiler_output TEXT,
    runtime_output TEXT,
    ai_review TEXT,
    judge_token TEXT
)
LANGUAGE SQL
AS
$$
SELECT *
FROM submissions
WHERE question_id = p_question_id
ORDER BY submitted_at DESC;
$$;

==========================================

CREATE OR REPLACE FUNCTION fn_update_submission_result
(
    p_id INTEGER,
    p_status TEXT,
    p_execution_time_ms INTEGER,
    p_memory_used_mb INTEGER,
    p_passed_test_cases INTEGER,
    p_total_test_cases INTEGER,
    p_score INTEGER,
    p_compiler_output TEXT,
    p_runtime_output TEXT,
    p_ai_review TEXT,
    p_judge_token TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE submissions
    SET
        status = p_status,
        execution_time_ms = p_execution_time_ms,
        memory_used_mb = p_memory_used_mb,
        passed_test_cases = p_passed_test_cases,
        total_test_cases = p_total_test_cases,
        score = p_score,
        compiler_output = p_compiler_output,
        runtime_output = p_runtime_output,
        ai_review = p_ai_review,
        judge_token = p_judge_token
    WHERE id = p_id;

    RETURN FOUND;

END;
$$;

===========================================

CREATE OR REPLACE FUNCTION fn_delete_submission
(
    p_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN

    DELETE
    FROM submissions
    WHERE id = p_id;

    RETURN FOUND;

END;
$$;


SELECT * from technologies
SELECT * from questions
SELECT * from submissions

SELECT * FROM fn_get_submission_by_id(3);