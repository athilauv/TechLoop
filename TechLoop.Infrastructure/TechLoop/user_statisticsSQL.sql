=======================================================================
//user_statistics
========================================================================

Get
--------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_get_user_statistics
(
    p_user_id UUID
)
RETURNS TABLE
(
    id UUID,
    user_id UUID,
    reputation_points INT,
    questions_solved INT,
    mcq_solved INT,
    coding_solved INT,
    total_submissions INT,
    accepted_submissions INT,
    failed_submissions INT,
    total_time_spent_minutes INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE sql
AS
$$
SELECT
    us.id,
    us.user_id,
    us.reputation_points,
    us.questions_solved,
    us.mcq_solved,
    us.coding_solved,
    us.total_submissions,
    us.accepted_submissions,
    us.failed_submissions,
    us.total_time_spent_minutes,
    us.created_at,
    us.updated_at
FROM user_statistics us
WHERE us.user_id = p_user_id;
$$;

------------------------------------------------------------------------
Create
------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_create_user_statistics
(
    p_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS
$$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO user_statistics
    (
        user_id,
        reputation_points,
        questions_solved,
        mcq_solved,
        coding_solved,
        total_submissions,
        accepted_submissions,
        failed_submissions,
        total_time_spent_minutes,
        created_at,
        updated_at
    )
    VALUES
    (
        p_user_id,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        NOW(),
        NOW()
    )
    RETURNING id
    INTO v_id;

    RETURN v_id;
END;
$$;

-----------------------------------------------------------------------
Update
-----------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE sp_update_user_statistics
(
    p_id UUID,
    p_reputation_points INT,
    p_questions_solved INT,
    p_mcq_solved INT,
    p_coding_solved INT,
    p_total_submissions INT,
    p_accepted_submissions INT,
    p_failed_submissions INT,
    p_total_time_spent_minutes INT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE user_statistics
    SET
        reputation_points = p_reputation_points,
        questions_solved = p_questions_solved,
        mcq_solved = p_mcq_solved,
        coding_solved = p_coding_solved,
        total_submissions = p_total_submissions,
        accepted_submissions = p_accepted_submissions,
        failed_submissions = p_failed_submissions,
        total_time_spent_minutes = p_total_time_spent_minutes,
        updated_at = NOW()
    WHERE id = p_id;
END;
$$;