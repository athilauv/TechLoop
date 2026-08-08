// import { useQuery } from '@tanstack/react-query';
// import { technologyCategoryService } from '../api/technologyCategoryService';
// import { technologyService } from '../api/technologyService';
//
// export const useTechnologyCategories = () => {
//     return useQuery({
//         queryKey: ['technology-categories'],
//         queryFn: () => technologyCategoryService.getCategories(),
//     });
// };
//
// export const useTechnologyCategory = (id: number) => {
//     return useQuery({
//         queryKey: ['technology-category', id],
//         queryFn: () => technologyCategoryService.getCategoryById(id),
//         enabled: !!id,
//     });
// };
//
// export const useTechnologies = () => {
//     return useQuery({
//         queryKey: ['technologies'],
//         queryFn: () => technologyService.getTechnologies(),
//     });
// };
//
// export const useTechnologyBySlug = (slug: string) => {
//     return useQuery({
//         queryKey: ['technology', slug],
//         queryFn: () => technologyService.getTechnologyBySlug(slug),
//         enabled: !!slug,
//     });
// };


import { useQuery } from "@tanstack/react-query";
import { technologyCategoryService } from "../api/technologyCategoryService";

export const useTechnologyCategories = () => {
    return useQuery({
        queryKey: ["technology-categories"],
        queryFn: technologyCategoryService.getCategories,
    });
};