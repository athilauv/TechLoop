export interface RunCodeRequest {
    questionId: number;
    technologyId: number;
    sourceCode: string;
    standardInput?: string | null;
    expectedOutput?: string | null;
    cpuTimeLimit?: number | null;
    memoryLimit?: number | null;
}

export interface Judge0SubmissionRequest {
    sourceCode: string;
    languageId: number;
    standardInput?: string | null;
    expectedOutput?: string | null;
    cpuTimeLimit?: number | null;
    memoryLimit?: number | null;
}

export interface Judge0SubmissionResponse {
    token: string;
}

export interface Judge0Status {
    id: number;
    description: string;
}

export interface Judge0ResultResponse {
    stdout: string | null;
    stderr: string | null;
    compileOutput: string | null;
    message: string | null;
    time: string | null;
    memory: number | null;
    token: string;
    status: Judge0Status;
}
