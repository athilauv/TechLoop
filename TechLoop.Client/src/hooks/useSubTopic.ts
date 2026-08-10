import { useQuery } from "@tanstack/react-query";

import { getSubTopicBySlug } from "../api/subTopic.api.ts";

export const useSubTopic = (slug: string) => {
    return useQuery({
        queryKey: ["sub-topic", slug],
        queryFn: () => getSubTopicBySlug(slug),
        enabled: !!slug,
    });
};