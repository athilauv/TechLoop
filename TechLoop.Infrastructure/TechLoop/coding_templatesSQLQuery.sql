/*=====================================================================
  CODING TEMPLATE REPOSITORY
  Table : coding_templates
=====================================================================*/


/*=====================================================================
  Repository Method : ExistsAsync
  Function Name     : fn_coding_template_exists
  Purpose           : Check whether a coding template already exists
                      for the specified question and technology.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_coding_template_exists
(
    p_question_id INT,
    p_technology_id INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM coding_templates
    WHERE question_id = p_question_id
      AND technology_id = p_technology_id
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : CreateAsync
  Function Name     : fn_create_coding_template
  Purpose           : Create a new coding template and return its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_create_coding_template
(
    p_question_id INT,
    p_technology_id INT,
    p_starter_code TEXT,
    p_solution_code TEXT,
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

    INSERT INTO coding_templates
    (
        question_id,
        technology_id,
        starter_code,
        solution_code,
        created_by,
        created_at
    )
    VALUES
    (
        p_question_id,
        p_technology_id,
        p_starter_code,
        p_solution_code,
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
  Procedure Name    : sp_update_coding_template
  Purpose           : Update an existing coding template.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_update_coding_template
(
    p_id INT,
    p_technology_id INT,
    p_starter_code TEXT,
    p_solution_code TEXT,
    p_updated_by UUID,
    p_updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE coding_templates
    SET
        technology_id = p_technology_id,
        starter_code = p_starter_code,
        solution_code = p_solution_code,
        updated_by = p_updated_by,
        updated_at = p_updated_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : SoftDeleteAsync
  Procedure Name    : sp_soft_delete_coding_template
  Purpose           : Soft delete a coding template.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_coding_template
(
    p_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE coding_templates
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : SoftDeleteByQuestionIdAsync
  Procedure Name    : sp_soft_delete_coding_template_by_question
  Purpose           : Soft delete all coding templates belonging to
                      the specified question.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_coding_template_by_question
(
    p_question_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE coding_templates
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE question_id = p_question_id
      AND deleted_at IS NULL;

END;
$$;

/*=====================================================================
  Repository Method : GetByIdAsync
  Function Name     : fn_get_coding_template_by_id
  Purpose           : Retrieve a coding template by its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_coding_template_by_id
(
    p_id INT
)
RETURNS TABLE
(
    id INT,
    question_id INT,
    technology_id INT,
    starter_code TEXT,
    solution_code TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
)
LANGUAGE SQL
AS
$$
SELECT
    ct.id,
    ct.question_id,
    ct.technology_id,
    ct.starter_code,
    ct.solution_code,
    ct.created_by,
    ct.created_at,
    ct.updated_by,
    ct.updated_at
FROM coding_templates ct
WHERE ct.id = p_id
  AND ct.deleted_at IS NULL;
$$;



/*=====================================================================
  Repository Method : GetByQuestionIdAsync
  Function Name     : fn_get_coding_templates_by_question_id
  Purpose           : Retrieve all coding templates for the specified
                      question.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_coding_templates_by_question_id
(
    p_question_id INT
)
RETURNS TABLE
(
    id INT,
    question_id INT,
    technology_id INT,
    starter_code TEXT,
    solution_code TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    updated_at TIMESTAMPTZ
)
LANGUAGE SQL
AS
$$
SELECT
    ct.id,
    ct.question_id,
    ct.technology_id,
    ct.starter_code,
    ct.solution_code,
    ct.created_by,
    ct.created_at,
    ct.updated_by,
    ct.updated_at
FROM coding_templates ct
WHERE ct.question_id = p_question_id
  AND ct.deleted_at IS NULL
ORDER BY ct.technology_id;
$$;