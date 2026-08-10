/*=====================================================================
  TOPIC REPOSITORY
  Table : topics
=====================================================================*/


/*=====================================================================
  Repository Method : ExistsAsync
  Function Name     : fn_topic_exists
  Purpose           : Check whether a topic with the same title
                      already exists within the given technology.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_topic_exists
(
    p_technology_id INT,
    p_title TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM topics
    WHERE technology_id = p_technology_id
      AND LOWER(title) = LOWER(p_title)
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : SlugExistsAsync
  Function Name     : fn_topic_slug_exists
  Purpose           : Check whether the slug already exists.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_topic_slug_exists
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
    FROM topics
    WHERE LOWER(slug) = LOWER(p_slug)
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : PositionExistsAsync
  Function Name     : fn_topic_position_exists
  Purpose           : Check whether a position already exists inside
                      a technology.
=====================================================================*/
CREATE OR REPLACE FUNCTION fn_topic_position_exists
(
    p_technology_id INT,
    p_position INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM topics
    WHERE technology_id = p_technology_id
      AND position = p_position
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : TechnologyExistsAsync
  Function Name     : fn_topic_technology_exists
  Purpose           : Check whether the technology exists.
=====================================================================*/


CREATE OR REPLACE FUNCTION fn_topic_technology_exists
(
    p_technology_id INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM technologies
    WHERE id = p_technology_id
);
$$;



/*=====================================================================
  Repository Method : CreateAsync
  Function Name     : fn_create_topic
  Purpose           : Create a new topic and return its ID.
=====================================================================*/
DROP FUNCTION IF EXIS
CREATE OR REPLACE FUNCTION fn_create_topic
(
    p_technology_id INT,
    p_title TEXT,
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

    INSERT INTO topics
    (
        technology_id,
        title,
        slug,
        description,
        image_url,
        position,
        created_by,
        created_at
    )
    VALUES
    (
        p_technology_id,
        p_title,
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
  Function Name     : fn_get_topic_by_id
  Purpose           : Retrieve a topic by its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_topic_by_id
(
    p_id INT
)
RETURNS TABLE
(
    id INT,
    technology_id INT,
    title TEXT,
    description TEXT,
    slug TEXT,
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
    t.technology_id,
    t.title,
    t.description,
    t.slug,
    t.image_url,
    t.position,
    t.published_at,
    t.published_by,
    t.created_by,
    t.created_at,
    t.updated_at,
    t.updated_by
FROM topics t
WHERE t.id = p_id
  AND t.deleted_at IS NULL;
$$;



/*=====================================================================
  Repository Method : UpdateAsync
  Procedure Name    : sp_update_topic
  Purpose           : Update topic details.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_update_topic
(
    p_id INT,
    p_technology_id INT,
    p_title TEXT,
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


    UPDATE topics
    SET
        technology_id = p_technology_id,
        title = p_title,
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
  Procedure Name    : sp_soft_delete_topic
  Purpose           : Soft delete a topic.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_topic
(
    p_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE topics
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;


/*=====================================================================
  Repository Method : GetAllAsync
  Function Name     : fn_get_all_topics
  Purpose           : Get all active topics.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_all_topics()
RETURNS TABLE
(
    id INT,
    technology_id INT,
    title TEXT,
    slug TEXT,
    description TEXT,
    image_url TEXT,
    "position" INT,
    published_at TIMESTAMPTZ,
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
    t.technology_id,
    t.title,
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
FROM topics t
WHERE t.deleted_at IS NULL
ORDER BY t.position;
$$;



/*=====================================================================
  Repository Method : PublishAsync
  Procedure Name    : sp_publish_topic
  Purpose           : Publish a topic.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_publish_topic(
    IN p_id integer,
    IN p_published_by uuid,
    IN p_published_at timestamp with time zone
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE topics
    SET
        published_by = p_published_by,
        published_at = p_published_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : GetPublishedAsync
  Function Name     : fn_get_published_topics
  Purpose           : Retrieve all published topics.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_published_topics()
RETURNS TABLE
(
    id INT,
    technology_id INT,
    title TEXT,
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
    t.technology_id,
    t.title,
    t.slug,
    t.description,
    t.image_url,
    t.position
FROM topics t
WHERE t.published_at IS NOT NULL
  AND t.deleted_at IS NULL
ORDER BY t.position;
$$;



/*=====================================================================
  Repository Method : GetPublishedByIdAsync
  Function Name     : fn_get_published_topic_by_id
  Purpose           : Retrieve a published topic by ID.
=====================================================================*/
CREATE OR REPLACE FUNCTION fn_get_published_topic_by_slug
(
    p_slug TEXT
)
RETURNS TABLE
(
    id INT,
    technology_id INT,
    title TEXT,
    slug TEXT,
    description TEXT,
    image_url VARCHAR,
    "position" INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE SQL
AS
$$
SELECT
    t.id,
    t.technology_id,
    t.title,
    t.slug,
    t.description,
    t.image_url,
    t.position,
    t.created_at,
    t.updated_at
FROM topics t
WHERE t.slug = p_slug
  AND t.published_at IS NOT NULL
  AND t.deleted_at IS NULL;
$$;