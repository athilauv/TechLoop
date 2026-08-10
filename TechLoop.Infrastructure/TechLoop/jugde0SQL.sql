

CREATE OR REPLACE FUNCTION fn_create_submission(
    p_user_id UUID,
    p_question_id INT,
    p_technology_id INT,
    p_source_code TEXT,
    p_selected_option_id INT,
    p_attempt_number INT,
    p_status TEXT,
    p_submitted_at TIMESTAMPTZ
)
RETURNS INT
LANGUAGE plpgsql
AS
$$
DECLARE
    v_submission_id INT;
BEGIN
    INSERT INTO submissions
    (
        user_id,
        question_id,
        technology_id,
        source_code,
        selected_option_id,
        attempt_number,
        status,
        submitted_at
    )
    VALUES
    (
        p_user_id,
        p_question_id,
        p_technology_id,
        p_source_code,
        p_selected_option_id,
        p_attempt_number,
        p_status::submission_status,
        p_submitted_at
    )
    RETURNING id
    INTO v_submission_id;

    RETURN v_submission_id;
END;
$$;

//===================================================================
//update submission result
//===================================================================

CREATE OR REPLACE PROCEDURE sp_update_submission_result
(
    p_id INT,
    p_status TEXT,
    p_execution_time_ms INT,
    p_memory_used_mb INT,
    p_passed_test_cases INT,
    p_total_test_cases INT,
    p_score INT,
    p_compiler_output TEXT,
    p_runtime_output TEXT,
    p_ai_review TEXT,
    p_judge_token VARCHAR
)
LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE submissions
    SET
        status = p_status::submission_status,
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
END;
$$;

======================================================================

CREATE OR REPLACE FUNCTION fn_get_judge0_language_id(
    p_technology_id INT
)
RETURNS INT
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN (
        SELECT judge0_language_id
        FROM technologies
        WHERE id = p_technology_id
          AND deleted_at IS NULL
    );
END;
$$;