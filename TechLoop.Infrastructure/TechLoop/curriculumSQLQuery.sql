curriculum
============================

CREATE OR REPLACE FUNCTION fn_get_mentor_curriculum
(
    p_user_id UUID
)
RETURNS TABLE
(
    technology_id INTEGER,
    technology_name VARCHAR,

    topic_id INTEGER,
	parent_sub_topic_id INTEGER,
    topic_title VARCHAR,
    topic_slug VARCHAR,
    topic_position INTEGER,
    topic_created_at TIMESTAMPTZ,
    topic_updated_at TIMESTAMPTZ,
    topic_published_at TIMESTAMPTZ,

    sub_topic_id INTEGER,
    sub_topic_title VARCHAR,
    sub_topic_slug VARCHAR,
    sub_topic_position INTEGER,
    sub_topic_created_at TIMESTAMPTZ,
    sub_topic_updated_at TIMESTAMPTZ,
    sub_topic_published_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
AS
$$

SELECT

    tech.id,
    tech.name,
    tp.id,
	st.parent_sub_topic_id,
    tp.title,
    tp.slug,
    tp.position,
    tp.created_at,
    tp.updated_at,
    tp.published_at,

    st.id,
    st.title,
    st.slug,
    st.position,
    st.created_at,
    st.updated_at,
    st.published_at

FROM mentor m

INNER JOIN technologies tech
ON tech.id = m.technology_id

LEFT JOIN topics tp
ON tp.technology_id = tech.id
AND tp.deleted_at IS NULL

LEFT JOIN sub_topics st
ON st.topic_id = tp.id
AND st.deleted_at IS NULL

WHERE
    m.user_id = p_user_id
    AND m.deleted_at IS NULL

ORDER BY
    tp.position,
    st.position;

$$;



==============================================================
//get_learner_curriculum
=============================================================================

CREATE OR REPLACE FUNCTION fn_get_learner_curriculum
(
    p_technology_id INTEGER
)
RETURNS TABLE
(
    technology_id INTEGER,
    technology_name VARCHAR,

    topic_id INTEGER,
    parent_sub_topic_id INTEGER,
    topic_title VARCHAR,
    topic_slug VARCHAR,
    topic_position INTEGER,
    topic_created_at TIMESTAMPTZ,
    topic_updated_at TIMESTAMPTZ,

    sub_topic_id INTEGER,
    sub_topic_title VARCHAR,
    sub_topic_slug VARCHAR,
    sub_topic_position INTEGER,
    sub_topic_created_at TIMESTAMPTZ,
    sub_topic_updated_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
AS
$$

SELECT

    tech.id,
    tech.name,

    tp.id,
    st.parent_sub_topic_id,
    tp.title,
    tp.slug,
    tp.position,
    tp.created_at,
    tp.updated_at,

    st.id,
    st.title,
    st.slug,
    st.position,
    st.created_at,
    st.updated_at

FROM technologies tech

LEFT JOIN topics tp
ON tp.technology_id = tech.id
AND tp.deleted_at IS NULL
AND tp.published_at IS NOT NULL

LEFT JOIN sub_topics st
ON st.topic_id = tp.id
AND st.deleted_at IS NULL
AND st.published_at IS NOT NULL

WHERE
    tech.id = p_technology_id
    AND tech.deleted_at IS NULL

ORDER BY
    tp.position,
    st.position;

$$;