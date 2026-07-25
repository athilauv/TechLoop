import { useEffect, useState } from "react";
import technologyCategoryService from "../services/technologyCategoryService";
import type { TechnologyCategory } from "../types/technologyCategory";

export function useTechnologyCategories() {
    const [categories, setCategories] = useState<TechnologyCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await technologyCategoryService.getAll();
            setCategories(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load technology categories.");
        } finally {
            setLoading(false);
        }
    }

    return {
        categories,
        loading,
        error,
        reload: loadCategories,
    };
}