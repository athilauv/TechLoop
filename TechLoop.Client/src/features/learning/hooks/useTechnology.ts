import { useQuery } from "@tanstack/react-query";

import {
    getTechnologies,
    getTechnologyBySlug,
    getTechnologyCategories,
} from "../api/technology.api";

export const useTechnologyCategories = () => {
    return useQuery({
        queryKey: ["technology-categories"],
        queryFn: getTechnologyCategories,
    });
};

export const useTechnologies = () => {
    return useQuery({
        queryKey: ["technologies"],
        queryFn: getTechnologies,
    });
};

export const useTechnology = (slug: string) => {
    return useQuery({
        queryKey: ["technology", slug],
        queryFn: () => getTechnologyBySlug(slug),
        enabled: !!slug,
    });
};