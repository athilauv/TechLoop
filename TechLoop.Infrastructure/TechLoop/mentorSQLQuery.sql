-- =====================================================
-- Function: fn_mentor_exists
-- Checks if a mentor already exists for the given user + technology
-- =====================================================
CREATE OR REPLACE FUNCTION fn_mentor_exists(
    p_user_id       UUID,
    p_technology_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM mentor
        WHERE user_id = p_user_id
          AND technology_id = p_technology_id
          AND deleted_at IS NULL
    );
$$;

-- =====================================================
-- Function: fn_mentor_user_exists
-- =====================================================
CREATE OR REPLACE FUNCTION fn_mentor_user_exists(
    p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM "users"
        WHERE id = p_user_id
    );
$$;

-- =====================================================
-- Function: fn_mentor_technology_exists
-- =====================================================
CREATE OR REPLACE FUNCTION fn_mentor_technology_exists(
    p_technology_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM technologies
        WHERE id = p_technology_id
          AND deleted_at IS NULL
    );
$$;

-- =====================================================
-- Function: fn_create_mentor
-- =====================================================
CREATE OR REPLACE FUNCTION fn_create_mentor(
    p_user_id       UUID,
    p_technology_id INTEGER,
    p_created_at    TIMESTAMPTZ
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_id INTEGER;
BEGIN
    INSERT INTO mentor (
        user_id,
        technology_id,
        created_at
    )
    VALUES (
        p_user_id,
        p_technology_id,
        p_created_at
    )
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

-- =====================================================
-- Function: fn_get_mentor_by_id
-- =====================================================
CREATE OR REPLACE FUNCTION fn_get_mentor_by_id(
    p_id INTEGER
)
RETURNS TABLE (
    id              INTEGER,
    user_id         UUID,
    technology_id   INTEGER,
    updated_by      UUID,
    created_at      TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ,
    deleted_at      TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        id,
        user_id,
        technology_id,
        updated_by,
        created_at,
        updated_at,
        deleted_at
    FROM mentor
    WHERE id = p_id
      AND deleted_at IS NULL;
$$;

-- =====================================================
-- Function: fn_get_all_mentors
-- =====================================================
CREATE OR REPLACE FUNCTION fn_get_all_mentors()
RETURNS TABLE (
    id              INTEGER,
    user_id         UUID,
    technology_id   INTEGER,
    updated_by      UUID,
    created_at      TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ,
    deleted_at      TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        id,
        user_id,
        technology_id,
        updated_by,
        created_at,
        updated_at,
        deleted_at
    FROM mentor
    WHERE deleted_at IS NULL
    ORDER BY id;
$$;