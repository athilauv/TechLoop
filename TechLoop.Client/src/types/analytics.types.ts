export interface AnalyticsOverview {
    questionsSolved: number;
    codingCompleted: number;
    mcqsCompleted: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    failedAttempts: number;
    totalTimeSpentMinutes: number;
}

export interface PracticeActivity {
    date: string;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
}

export interface TechnologyPractice {
    technologyId: number;
    technologyName: string;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
}

export interface TopicAnalytics {
    topicId: number;
    topicName: string;
    completedQuestions: number;
    lastPracticedAt: string | null;
}

export interface DifficultyProgression {
    difficulty: number;
    difficultyName: string;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
}

export interface DailyActivity {
    date: string;
    totalActivities: number;
    questionsSolved: number;
    codingCompleted: number;
    mcqsCompleted: number;
    successfulAttempts: number;
    failedAttempts: number;
    timeSpentMinutes: number;
}

export interface AnalyticsResponse {
    overview: AnalyticsOverview | null;
    practiceActivity: PracticeActivity[];
    technologyPractice: TechnologyPractice[];
    topicAnalytics: TopicAnalytics[];
    difficultyProgression: DifficultyProgression[];
    dailyActivity: DailyActivity[];
}
