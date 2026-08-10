/*=====================================================================
  TECHNOLOGY REPOSITORY
  Table : technologies
=====================================================================*/


/*=====================================================================
  Repository Method : ExistsAsync
  Function Name     : fn_technology_exists
  Purpose           : Check whether a technology with the same name
                      already exists within the given category.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_technology_exists
(
    p_category_id INT,
    p_name TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM technologies
    WHERE category_id = p_category_id
      AND LOWER(name) = LOWER(p_name)
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : SlugExistsAsync
  Function Name     : fn_technology_slug_exists
  Purpose           : Check whether the slug already exists.
=====================================================================*/
DROP FUNCTION IF EXISTS fn_technology_slug_exists
CREATE OR REPLACE FUNCTION fn_technology_slug_exists
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
    FROM technologies
    WHERE LOWER(slug)=LOWER(p_slug)
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : PositionExistsAsync
  Function Name     : fn_technology_position_exists
  Purpose           : Check whether a position already exists inside
                      a category.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_technology_position_exists
(
    p_category_id INT,
    p_position INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM technologies
    WHERE category_id = p_category_id
      AND position = p_position
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : CategoryExistsAsync
  Function Name     : fn_technology_category_exists
  Purpose           : Check whether the category exists.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_technology_category_exists
(
    p_category_id INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM technology_categories
    WHERE id = p_category_id
);
$$;



/*=====================================================================
  Repository Method : CreateAsync
  Function Name     : fn_create_technology
  Purpose           : Create a new technology and return its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_create_technology
(
    p_category_id INT,
    p_name TEXT,
    p_slug TEXT,
    p_description TEXT,
    p_image_url TEXT,
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

    INSERT INTO technologies
    (
        category_id,
        name,
        slug,
        description,
        image_url,
        position,
        created_by,
        created_at
    )
    VALUES
    (
        p_category_id,
        p_name,
        p_slug,
        p_description,
        p_image_url,
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
  Repository Method : GetByIdAsync
  Function Name     : fn_get_technology_by_id
  Purpose           : Retrieve a technology by its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_technology_by_id
(
    p_id INT
)
RETURNS TABLE
(
    id INT,
    category_id INT,
    name TEXT,
    slug TEXT,
    description TEXT,
    image_url TEXT,
    position INT,
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
    t.id,
    t.category_id,
    t.name,
    t.slug,
    t.description,
    t.image_url,
    t.position,
    t.published_at,
    t.published_by,
    t.created_by,
    t.created_at,
    t.updated_at,
    t.updated_by
FROM technologies t
WHERE t.id = p_id
  AND t.deleted_at IS NULL;
$$;



/*=====================================================================
  Repository Method : UpdateAsync
  Procedure Name    : sp_update_technology
  Purpose           : Update technology details.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_update_technology
(
    p_id INT,
    p_category_id INT,
    p_name TEXT,
    p_slug TEXT,
    p_description TEXT,
    p_image_url TEXT,
    p_position INT,
    p_updated_by UUID,
    p_updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE technologies
    SET
        category_id = p_category_id,
        name = p_name,
        slug = p_slug,
        description = p_description,
        image_url = p_image_url,
        position = p_position,
        updated_by = p_updated_by,
        updated_at = p_updated_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : SoftDeleteAsync
  Procedure Name    : sp_soft_delete_technology
  Purpose           : Soft delete a technology.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_technology
(
    p_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE technologies
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : GetAllAsync
  Function Name     : fn_get_all_technologies
  Purpose           : Get all active technologies.
=====================================================================*/
DROP FUNCTION IF EXISTS
CREATE OR REPLACE FUNCTION fn_get_all_technologies()
RETURNS TABLE
(
    id INT,
    category_id INT,
    name TEXT,
    slug TEXT,
    description TEXT,
    image_url TEXT,
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
    t.id,
    t.category_id,
    t.name,
    t.slug,
    t.description,
    t.image_url,
    t.position,
    t.published_at,
    t.published_by,
    t.created_by,
    t.created_at,
    t.updated_at,
    t.updated_by
FROM technologies t
WHERE t.deleted_at IS NULL
ORDER BY t.position;
$$;



/*=====================================================================
  Repository Method : PublishAsync
  Procedure Name    : sp_publish_technology
  Purpose           : Publish a technology.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_publish_technology
(
    p_id INT,
    p_published_by UUID,
    p_published_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE technologies
    SET
        published_by = p_published_by,
        published_at = p_published_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : GetPublishedAsync
  Function Name     : fn_get_published_technologies
  Purpose           : Retrieve all published technologies.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_published_technologies()
RETURNS TABLE
(
    id INT,
    name TEXT,
    slug TEXT,
    description TEXT,
    image_url TEXT,
    "position" INT
)
LANGUAGE SQL
AS
$$
SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    t.image_url,
    t.position
FROM technologies t
WHERE t.published_at IS NOT NULL
  AND t.deleted_at IS NULL
ORDER BY t.position;
$$;



/*=====================================================================
  Repository Method : GetPublishedByIdAsync
  Function Name     : fn_get_published_technology_by_id
  Purpose           : Retrieve a published technology by ID.
=====================================================================*/


CREATE OR REPLACE FUNCTION fn_get_published_technology_by_slug
(
    p_slug TEXT
)
RETURNS TABLE
(
    id INT,
    name TEXT,
    slug TEXT,
    description TEXT,
    image_url TEXT,
    "position" INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE SQL
AS
$$
SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    t.image_url,
    t.position,
    t.created_at,
    t.updated_at
FROM technologies t
WHERE t.slug = p_slug
  AND t.published_at IS NOT NULL
  AND t.deleted_at IS NULL;
$$;