import { useQuery } from "@tanstack/react-query";
import { getCurriculum } from "../api/curriculum.api.ts";

export const useCurriculum = (technologyId: number) => {
    return useQuery({
        queryKey: ["curriculum", technologyId],
        queryFn: () => getCurriculum(technologyId),
        enabled: technologyId > 0,
    });
};