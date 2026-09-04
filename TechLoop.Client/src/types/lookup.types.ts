export interface LookupOption {
    id: number;
    name: string;
}

export interface Lookups {
    difficultyLevels: LookupOption[];
    questionTypes: LookupOption[];
    exampleTypes: LookupOption[];
}
