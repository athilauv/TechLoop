import { useQuery } from "@tanstack/react-query";
import { technologyService } from "../api/technologyService";

export const useTechnologies = () => {
    return useQuery({
        queryKey: ["technologies"],
        queryFn: technologyService.getTechnologies,
    });
};