export interface DashboardOverview {
    questionsSolved: number;
    codingCompleted: number;
    mcqsCompleted: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    failedAttempts: number;
    totalTimeSpentMinutes: number;
}

export interface DashboardActivity {
    date: string;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
}

export interface DashboardTechnology {
    technologyId: number;
    technologyName: string;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
}

export interface DashboardTopic {
    topicId: number;
    topicName: string;
    completedQuestions: number;
    lastPracticedAt: string | null;
}

export interface DashboardDifficulty {
    difficulty: number;
    difficultyName: string;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
}

export interface DashboardResponse {
    overview: DashboardOverview | null;
    practiceActivity: DashboardActivity[];
    technologyPractice: DashboardTechnology[];
    topicAnalytics: DashboardTopic[];
    difficultyProgression: DashboardDifficulty[];
}
