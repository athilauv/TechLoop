/*=====================================================================
  SUBTOPIC REPOSITORY
  Table : sub_topics
=====================================================================*/


/*=====================================================================
  Repository Method : ExistsAsync
  Function Name     : fn_subtopic_exists
  Purpose           : Check whether a subtopic with the same title
                      already exists within the given topic.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_subtopic_exists
(
    p_topic_id INT,
    p_title TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM sub_topics
    WHERE topic_id = p_topic_id
      AND LOWER(title) = LOWER(p_title)
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : SlugExistsAsync
  Function Name     : fn_subtopic_slug_exists
  Purpose           : Check whether the slug already exists.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_subtopic_slug_exists
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
    FROM sub_topics
    WHERE LOWER(slug) = LOWER(p_slug)
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : PositionExistsAsync
  Function Name     : fn_subtopic_position_exists
  Purpose           : Check whether a position already exists inside
                      the given topic.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_subtopic_position_exists
(
    p_topic_id INT,
    p_position INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM sub_topics
    WHERE topic_id = p_topic_id
      AND position = p_position
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : TopicExistsAsync
  Function Name     : fn_subtopic_topic_exists
  Purpose           : Check whether the topic exists.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_subtopic_topic_exists
(
    p_topic_id INT
)
RETURNS BOOLEAN
LANGUAGE SQL
AS
$$
SELECT EXISTS
(
    SELECT 1
    FROM topics
    WHERE id = p_topic_id
      AND deleted_at IS NULL
);
$$;



/*=====================================================================
  Repository Method : CreateAsync
  Function Name     : fn_create_subtopic
  Purpose           : Create a new subtopic and return its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_create_subtopic
(
    p_topic_id INT,
    p_slug TEXT,
    p_title TEXT,
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

    INSERT INTO sub_topics
    (
        topic_id,
        slug,
        title,
        description,
        image_url,
        position,
        created_by,
        created_at
    )
    VALUES
    (
        p_topic_id,
        p_slug,
        p_title,
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
  Repository Method : UpdateAsync
  Procedure Name    : sp_update_subtopic
  Purpose           : Update subtopic details.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_update_subtopic
(
    p_id INT,
    p_topic_id INT,
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

    UPDATE sub_topics
    SET
        topic_id = p_topic_id,
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
  Procedure Name    : sp_soft_delete_subtopic
  Purpose           : Soft delete a subtopic.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_soft_delete_subtopic
(
    p_id INT,
    p_deleted_by UUID,
    p_deleted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE sub_topics
    SET
        deleted_by = p_deleted_by,
        deleted_at = p_deleted_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;



/*=====================================================================
  Repository Method : PublishAsync
  Procedure Name    : sp_publish_subtopic
  Purpose           : Publish a subtopic.
=====================================================================*/

CREATE OR REPLACE PROCEDURE sp_publish_subtopic
(
    p_id INT,
    p_published_by UUID,
    p_published_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS
$$
BEGIN

    UPDATE sub_topics
    SET
        published_by = p_published_by,
        published_at = p_published_at
    WHERE id = p_id
      AND deleted_at IS NULL;

END;
$$;


/*=====================================================================
  Repository Method : GetByIdAsync
  Function Name     : fn_get_subtopic_by_id
  Purpose           : Retrieve a subtopic by its ID.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_subtopic_by_id
(
    p_id INT
)
RETURNS TABLE
(
    id INT,
    topic_id INT,
    slug TEXT,
    title TEXT,
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
    st.id,
    st.topic_id,
    st.slug,
    st.title,
    st.description,
    st.image_url,
    st.position,
    st.published_at,
    st.published_by,
    st.created_by,
    st.created_at,
    st.updated_at,
    st.updated_by
FROM sub_topics st
WHERE st.id = p_id
  AND st.deleted_at IS NULL;
$$;



/*=====================================================================
  Repository Method : GetAllAsync
  Function Name     : fn_get_all_subtopics
  Purpose           : Get all active subtopics.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_all_subtopics()
RETURNS TABLE
(
    id INT,
    topic_id INT,
    slug TEXT,
    title TEXT,
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
    st.id,
    st.topic_id,
    st.slug,
    st.title,
    st.description,
    st.image_url,
    st.position,
    st.published_at,
    st.published_by,
    st.created_by,
    st.created_at,
    st.updated_at,
    st.updated_by
FROM sub_topics st
WHERE st.deleted_at IS NULL
ORDER BY st.position;
$$;



/*=====================================================================
  Repository Method : GetPublishedAsync
  Function Name     : fn_get_published_subtopics
  Purpose           : Retrieve all published subtopics.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_published_subtopics()
RETURNS TABLE
(
    id INT,
    topic_id INT,
    slug TEXT,
    title TEXT,
    description TEXT,
    image_url TEXT,
    "position" INT
)
LANGUAGE SQL
AS
$$
SELECT
    st.id,
    st.topic_id,
    st.slug,
    st.title,
    st.description,
    st.image_url,
    st.position
FROM sub_topics st
WHERE st.published_at IS NOT NULL
  AND st.deleted_at IS NULL
ORDER BY st.position;
$$;



/*=====================================================================
  Repository Method : GetPublishedBySlugAsync
  Function Name     : fn_get_published_subtopic_by_slug
  Purpose           : Retrieve a published subtopic by slug.
=====================================================================*/

CREATE OR REPLACE FUNCTION fn_get_published_subtopic_by_slug
(
    p_slug TEXT
)
RETURNS TABLE
(
    id INT,
    topic_id INT,
    slug TEXT,
    title TEXT,
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
    st.id,
    st.topic_id,
    st.slug,
    st.title,
    st.description,
    st.image_url,
    st.position,
    st.created_at,
    st.updated_at
FROM sub_topics st
WHERE st.slug = p_slug
  AND st.published_at IS NOT NULL
  AND st.deleted_at IS NULL;
$$;