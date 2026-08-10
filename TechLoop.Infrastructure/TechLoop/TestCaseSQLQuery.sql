/*=====================================================================
  TEST CASE REPOSITORY
  Table : test_cases
=====================================================================*/


/*=====================================================================
  Repository Method : PositionExistsAsync
  Function Name     : fn_test_case_position_exists
  Purpose           : Check whether the specified position already
                      exists for the question.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_test_case_position_exists
(
    p_question_id INT,
    p_position INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM test_cases
    WHERE question_id = p_question_id
      AND position = p_position
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : CreateAsync
  Function Name     : fn_create_test_case
  Purpose           : Create a new test case and return its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_create_test_case
(
    p_question_id INT,
    p_input TEXT,
    p_expected_output TEXT,
    p_is_hidden BOOLEAN,
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

    INSERT INTO test_cases
    (
        question_id,
        input,
        expected_output,
        is_hidden,
        position,
        created_by,
        created_at
    )
    VALUES
    (
        p_question_id,
        p_input,
        p_expected_output,
        p_is_hidden,
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
  Procedure Name    : sp_update_test_case
  Purpose           : Update an existing test case.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_update_test_case
(
    p_id INT,
    p_input TEXT,
    p_expected_output TEXT,
    p_is_hidden BOOLEAN,
    p_position INT,
    p_updated_by UUID,
    p_updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE test_cases
    SET
        input = p_input,
        expected_output = p_expected_output,
        is_hidden = p_is_hidden,
        position = p_position,
        updated_by = p_updated_by,
        updated_at = p_updated_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : SoftDeleteAsync
  Procedure Name    : sp_soft_delete_test_case
  Purpose           : Soft delete a test case.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_test_case
(
    p_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE test_cases
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : SoftDeleteByQuestionIdAsync
  Procedure Name    : sp_soft_delete_test_case_by_question
  Purpose           : Soft delete all test cases belonging to the
                      specified question.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_test_case_by_question
(
    p_question_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE test_cases
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE question_id = p_question_id
      AND deleted_at IS NULL;

END;
$$;


/*=====================================================================
  Repository Method : GetByIdAsync
  Function Name     : fn_get_test_case_by_id
  Purpose           : Retrieve a test case by its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_test_case_by_id
(
    p_id INT
)
RETURNS TABLE
(
    id INT,
    question_id INT,
    input TEXT,
    expected_output TEXT,
    is_hidden BOOLEAN,
    "position" INT,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
)
LANGUAGE SQL
AS
$$
SELECT
    tc.id,
    tc.question_id,
    tc.input,
    tc.expected_output,
    tc.is_hidden,
    tc.position,
    tc.created_by,
    tc.created_at,
    tc.updated_by,
    tc.updated_at
FROM test_cases tc
WHERE tc.id = p_id
  AND tc.deleted_at IS NULL;
$$;



/*=====================================================================
  Repository Method : GetByQuestionIdAsync
  Function Name     : fn_get_test_cases_by_question_id
  Purpose           : Retrieve all active test cases for the specified
                      question.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_test_cases_by_question_id
(
    p_question_id INT
)
RETURNS TABLE
(
    id INT,
    question_id INT,
    input TEXT,
    expected_output TEXT,
    is_hidden BOOLEAN,
    "position" INT,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
)
LANGUAGE SQL
AS
$$
SELECT
    tc.id,
    tc.question_id,
    tc.input,
    tc.expected_output,
    tc.is_hidden,
    tc.position,
    tc.created_by,
    tc.created_at,
    tc.updated_by,
    tc.updated_at
FROM test_cases tc
WHERE tc.question_id = p_question_id
  AND tc.deleted_at IS NULL
ORDER BY tc.position;
$$;



/*=====================================================================
  Repository Method : GetVisibleByQuestionIdAsync
  Function Name     : fn_get_visible_test_cases_by_question_id
  Purpose           : Retrieve all visible test cases for the specified
                      question.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_visible_test_cases_by_question_id
(
    p_question_id INT
)
RETURNS TABLE
(
    id INT,
    question_id INT,
    input TEXT,
    expected_output TEXT,
    is_hidden BOOLEAN,
    "position" INT,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
)
LANGUAGE SQL
AS
$$
SELECT
    tc.id,
    tc.question_id,
    tc.input,
    tc.expected_output,
    tc.is_hidden,
    tc.position,
    tc.created_by,
    tc.created_at,
    tc.updated_by,
    tc.updated_at
FROM test_cases tc
WHERE tc.question_id = p_question_id
  AND tc.is_hidden = FALSE
  AND tc.deleted_at IS NULL
ORDER BY tc.position;
$$;