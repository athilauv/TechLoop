/*=====================================================================
  MCQ OPTION REPOSITORY
  Table : mcq_options
=====================================================================*/


/*=====================================================================
  Repository Method : ExistsAsync
  Function Name     : fn_mcq_option_exists
  Purpose           : Check whether the specified option already exists
                      for the question.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_mcq_option_exists
(
    p_question_id INT,
    p_option_text TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM mcq_options
    WHERE question_id = p_question_id
      AND LOWER(option_text) = LOWER(p_option_text)
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : PositionExistsAsync
  Function Name     : fn_mcq_option_position_exists
  Purpose           : Check whether the specified position already
                      exists for the question.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_mcq_option_position_exists
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
    FROM mcq_options
    WHERE question_id = p_question_id
      AND position = p_position
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : GetOptionCountAsync
  Function Name     : fn_mcq_option_count
  Purpose           : Get the total number of active options for a
                      question.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_mcq_option_count
(
    p_question_id INT
)
RETURNS INT
LANGUAGE SQL
AS
$$
SELECT COUNT(*)
FROM mcq_options
WHERE question_id = p_question_id
  AND deleted_at IS NULL;
$$;



/*=====================================================================
  Repository Method : HasCorrectOptionAsync
  Function Name     : fn_mcq_has_correct_option
  Purpose           : Check whether the question contains at least one
                      correct option.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_mcq_has_correct_option
(
    p_question_id INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM mcq_options
    WHERE question_id = p_question_id
      AND is_correct = TRUE
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : CreateAsync
  Function Name     : fn_create_mcq_option
  Purpose           : Create a new MCQ option and return its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_create_mcq_option
(
    p_question_id INT,
    p_option_text TEXT,
    p_is_correct BOOLEAN,
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

    INSERT INTO mcq_options
    (
        question_id,
        option_text,
        is_correct,
        position,
        created_by,
        created_at
    )
    VALUES
    (
        p_question_id,
        p_option_text,
        p_is_correct,
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
  Procedure Name    : sp_update_mcq_option
  Purpose           : Update an existing MCQ option.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_update_mcq_option
(
    p_id INT,
    p_option_text TEXT,
    p_is_correct BOOLEAN,
    p_position INT,
    p_updated_by UUID,
    p_updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE mcq_options
    SET
        option_text = p_option_text,
        is_correct = p_is_correct,
        position = p_position,
        updated_by = p_updated_by,
        updated_at = p_updated_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : SoftDeleteAsync
  Procedure Name    : sp_soft_delete_mcq_option
  Purpose           : Soft delete an MCQ option.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_mcq_option
(
    p_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE mcq_options
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : SoftDeleteByQuestionIdAsync
  Procedure Name    : sp_soft_delete_mcq_option_by_question
  Purpose           : Soft delete all MCQ options belonging to a
                      question.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_mcq_option_by_question
(
    p_question_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE mcq_options
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE question_id = p_question_id
      AND deleted_at IS NULL;

END;
$$;

/*=====================================================================
  Repository Method : GetByIdAsync
  Function Name     : fn_get_mcq_option_by_id
  Purpose           : Retrieve an MCQ option by its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_mcq_option_by_id
(
    p_id INT
)
RETURNS TABLE
(
    id INT,
    question_id INT,
    option_text TEXT,
    is_correct BOOLEAN,
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
    mo.id,
    mo.question_id,
    mo.option_text,
    mo.is_correct,
    mo.position,
    mo.created_by,
    mo.created_at,
    mo.updated_by,
    mo.updated_at
FROM mcq_options mo
WHERE mo.id = p_id
  AND mo.deleted_at IS NULL;
$$;



/*=====================================================================
  Repository Method : GetByQuestionIdAsync
  Function Name     : fn_get_mcq_options_by_question_id
  Purpose           : Retrieve all active MCQ options for a question.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_mcq_options_by_question_id
(
    p_question_id INT
)
RETURNS TABLE
(
    id INT,
    question_id INT,
    option_text TEXT,
    is_correct BOOLEAN,
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
    mo.id,
    mo.question_id,
    mo.option_text,
    mo.is_correct,
    mo.position,
    mo.created_by,
    mo.created_at,
    mo.updated_by,
    mo.updated_at
FROM mcq_options mo
WHERE mo.question_id = p_question_id
  AND mo.deleted_at IS NULL
ORDER BY mo.position;
$$;