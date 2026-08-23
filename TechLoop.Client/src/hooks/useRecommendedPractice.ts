import { useMemo } from "react";
import { useQuestions } from "./useQuestion.ts";
import { QuestionType } from "../types/enums/question-type.ts";
import type { LearnerQuestion } from "../types/question.types.ts";

const RECOMMENDED_COUNT = 4;

export function useRecommendedPractice() {
    const { data, isLoading, error } = useQuestions();

    const questions = useMemo<LearnerQuestion[]>(() => {
        const all = data ?? [];

        const codingQuestions = all.filter(
            (question) => question.questionType === QuestionType.Coding
        );

        const byDifficulty = [...codingQuestions].sort(
            (a, b) => a.difficulty - b.difficulty
        );

        const seenDifficulties = new Set<number>();
        const spread: LearnerQuestion[] = [];

        for (const question of byDifficulty) {
            if (spread.length >= RECOMMENDED_COUNT) break;
            if (seenDifficulties.has(question.difficulty)) continue;

            seenDifficulties.add(question.difficulty);
            spread.push(question);
        }

        if (spread.length < RECOMMENDED_COUNT) {
            for (const question of byDifficulty) {
                if (spread.length >= RECOMMENDED_COUNT) break;
                if (spread.includes(question)) continue;

                spread.push(question);
            }
        }

        return spread;
    }, [data]);

    return {
        questions,
        isLoading,
        error,
    };
}
