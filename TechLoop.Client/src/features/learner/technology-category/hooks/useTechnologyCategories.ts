import { useQuery } from "@tanstack/react-query";
import { technologyCategoryService } from "../api/technologyCategoryService";

export const useTechnologyCategories = () => {
    return useQuery({
        queryKey: ["technology-categories"],
        queryFn: technologyCategoryService.getCategories,
    });
};